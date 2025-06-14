/**
 * Cloudflare Worker for the NYT Crossword Archive API
 * Provides access to historical crossword data stored in D1 database
 */

// Headers for CORS and content type
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS, POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // Error response helper
  function errorResponse(message, status = 400) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: message 
      }), 
      { 
        status: status, 
        headers: headers 
      }
    );
  }
  
  // Success response helper
  function successResponse(data) {
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: data,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 200, 
        headers: headers 
      }
    );
  }
  
  // Remove sensitive fields from response data
  function removeSensitiveFields(data) {
    // If it's an array, process each item
    if (Array.isArray(data)) {
      return data.map(item => removeSensitiveFields(item));
    }
    
    // If it's an object, remove permalink field
    if (data && typeof data === 'object') {
      // Create a new object without the permalink
      const { permalink, ...safeData } = data;
      
      // Process nested objects and arrays
      for (const key in safeData) {
        if (typeof safeData[key] === 'object' && safeData[key] !== null) {
          safeData[key] = removeSensitiveFields(safeData[key]);
        }
      }
      
      return safeData;
    }
    
    // Return primitives as is
    return data;
  }
  
  // Parse date parameters in various formats
  function parseDate(dateStr) {
    // Handle YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Handle MM/DD/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
      const [month, day, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Get today's date in YYYY-MM-DD format if "today" is passed
    if (dateStr.toLowerCase() === 'today') {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
    
    // Handle invalid date format
    return null;
  }
  
  // Get formatted date string
  function getFormattedDate(dateStr) {
    try {
      const dt = new Date(dateStr);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return dt.toLocaleDateString('en-US', options);
    } catch (error) {
      return "Unknown Date";
    }
  }
  
  // Get day of week
  function getDayOfWeek(dateStr) {
    try {
      const dt = new Date(dateStr);
      return dt.toLocaleDateString('en-US', { weekday: 'long' });
    } catch (error) {
      return null;
    }
  }
  
  // Add HTML entity decoder function
  function decodeHtmlEntities(text) {
    if (!text) return '';
    
    const entities = {
      '&quot;': '"',
      '&amp;': '&',
      '&#39;': "'",
      '&lt;': '<',
      '&gt;': '>',
      '&nbsp;': ' ',
      '&mdash;': '—',
      '&ndash;': '–',
      '&rsquo;': "'",
      '&lsquo;': "'",
      '&rdquo;': '"',
      '&ldquo;': '"',
      '&apos;': "'"
    };
    
    // Replace all HTML entities with their corresponding characters
    return text.replace(/&[^;]+;/g, (entity) => {
      if (entities[entity]) {
        return entities[entity];
      }
      
      // Handle numeric entities
      if (entity.match(/&#[0-9]+;/)) {
        const code = entity.replace(/&#([0-9]+);/, '$1');
        return String.fromCharCode(parseInt(code, 10));
      }
      
      return entity;
    });
  }
  
  // Function to clean and normalize clue text
  function cleanClueText(text) {
    if (!text) return '';
    
    // Remove HTML tags
    let cleaned = text.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    cleaned = decodeHtmlEntities(cleaned);
    
    // Remove any trailing colons
    cleaned = cleaned.replace(/:\s*$/, '');
    
    // Normalize spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  }
  
  // Router for handling API requests
  async function handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle OPTIONS request (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: headers });
    }
    
    // Add a root route handler to show API documentation
    if (path === '/' || path === '') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          api: "Crossword Archive API",
          version: "1.0.0",
          endpoints: [
            "/api/puzzle/{date} - Get puzzle by date (YYYY-MM-DD)",
            "/api/clues/{date} - Get clues by date (YYYY-MM-DD)",
            "/api/search/answer?q={answer} - Search clues by answer",
            "/api/search/clue?q={text} - Search answers by clue text",
            "/api/related/answer?q={answer} - Get related clues for an answer",
            "/api/add/{date} - Add or update puzzle for specific date",
            "/api/update/latest - Fetch and update the latest puzzle",
            "/api/delete/{date} - Deletes puzzle data for a specific date",
            "/today/commit/{apiKey} - Manually trigger an update of today.json on GitHub"
          ]
        }), 
        { 
          status: 200, 
          headers: headers 
        }
      );
    }
    
    // Route for getting puzzle by date
    if (path.startsWith('/api/puzzle/') && path.length > 12) {
      const dateParam = path.slice(12); // Extract date from URL
      const date = parseDate(dateParam);
      
      if (!date) {
        return errorResponse('Invalid date format. Use YYYY-MM-DD or MM/DD/YYYY.');
      }
      
      return await getPuzzleByDate(date, env);
    }
    
    // Route for getting clues by date
    if (path.startsWith('/api/clues/') && path.length > 11) {
      const dateParam = path.slice(11); // Extract date from URL
      const date = parseDate(dateParam);
      
      if (!date) {
        return errorResponse('Invalid date format. Use YYYY-MM-DD or MM/DD/YYYY.');
      }
      
      return await getCluesByDate(date, env);
    }
    
    // Route for searching clues by answer
    if (path === '/api/search/answer') {
      const params = url.searchParams;
      const answer = params.get('q');
      
      if (!answer) {
        return errorResponse('Missing search query parameter "q".');
      }
      
      return await searchByAnswer(answer, env);
    }
    
    // Route for searching answers by clue text
    if (path === '/api/search/clue') {
      const params = url.searchParams;
      const clueText = params.get('q');
      
      if (!clueText) {
        return errorResponse('Missing search query parameter "q".');
      }
      
      return await searchByClueText(clueText, env);
    }
    
    // Route for getting all related clues for an answer
    if (path === '/api/related/answer') {
      const params = url.searchParams;
      const answer = params.get('q');
      
      if (!answer) {
        return errorResponse('Missing search query parameter "q".');
      }
      
      return await getRelatedClues(answer, env);
    }
    
    // NEW: Route for adding a puzzle for a specific date
    if (path.startsWith('/api/add/') && path.length > 9) {
      const dateParam = path.slice(9); // Extract date from URL
      const date = parseDate(dateParam);
      
      if (!date) {
        return errorResponse('Invalid date format. Use YYYY-MM-DD.');
      }
      
      // Check if authorization is needed
      const authToken = request.headers.get('Authorization');
      if (env.API_TOKEN && (!authToken || authToken !== `Bearer ${env.API_TOKEN}`)) {
        return errorResponse('Unauthorized access. Valid token required.', 401);
      }
      
      return await fetchAndAddPuzzle(date, env);
    }
    
    // NEW: Route for fetching and adding the latest puzzle
    if (path === '/api/update/latest') {
      // Check if authorization is needed
      const authToken = request.headers.get('Authorization');
      if (env.API_TOKEN && (!authToken || authToken !== `Bearer ${env.API_TOKEN}`)) {
        return errorResponse('Unauthorized access. Valid token required.', 401);
      }
      
      return await fetchAndAddLatestPuzzle(env);
    }
    
    // Add a new endpoint for deleting puzzle data
    if (path.startsWith('/api/delete/') && path.length > 12) {
      const dateParam = path.slice(12); // Extract date from URL
      const date = parseDate(dateParam);
      
      if (!date) {
        return errorResponse('Invalid date format. Use YYYY-MM-DD.');
      }
      
      // Check if authorization is needed
      const authToken = request.headers.get('Authorization');
      if (env.API_TOKEN && (!authToken || authToken !== `Bearer ${env.API_TOKEN}`)) {
        return errorResponse('Unauthorized access. Valid token required.', 401);
      }
      
      return await deletePuzzleByDate(date, env);
    }
    
    // NEW: Manual endpoint to trigger today's puzzle commit to GitHub
    if (path.startsWith('/today/commit/')) {
      const apiKey = path.substring('/today/commit/'.length);
      
      // Check if the API token is configured and matches
      if (!env.API_TOKEN || apiKey !== env.API_TOKEN) {
        return errorResponse('Unauthorized access. Invalid API key.', 401);
      }
      
      // Manually trigger the fetch and update process
      console.log("Manual trigger for today's puzzle update initiated.");
      return await fetchAndAddLatestPuzzle(env);
    }
    
    // Default response for unknown routes
    return errorResponse('Endpoint not found.', 404);
  }
  
  // NEW: Helper to get raw puzzle data from DB without formatting a response
  async function getRawPuzzleDataByDate(date, env) {
      // Get puzzle info
      const puzzleData = await env.DB.prepare(`
        SELECT * FROM puzzles WHERE date = ?
      `).bind(date).first();
      
      if (!puzzleData) {
      return null;
      }
      
      // Get all clues for this puzzle
      const clues = await env.DB.prepare(`
        SELECT * FROM clues 
        WHERE puzzle_id = ? 
        ORDER BY 
          CASE direction 
            WHEN 'across' THEN 0 
            WHEN 'down' THEN 1 
            ELSE 2 
          END, 
          number
      `).bind(puzzleData.puzzle_id).all();
      
    // Format the data into the structure needed for today.json
      const result = {
        puzzle: puzzleData,
        clues: clues.results,
        across: clues.results.filter(c => c.direction === 'across'),
        down: clues.results.filter(c => c.direction === 'down')
      };
      
    return result;
  }
  
  // Get puzzle and all clues for a specific date
  async function getPuzzleByDate(date, env) {
    try {
      const result = await getRawPuzzleDataByDate(date, env);
      
      if (!result) {
        return errorResponse(`No puzzle found for date: ${date}`, 404);
      }
      
      // Remove sensitive fields before returning the response
      return successResponse(removeSensitiveFields(result));
    } catch (error) {
      return errorResponse(`Database error: ${error.message}`, 500);
    }
  }
  
  // Get just the clues for a specific date
  async function getCluesByDate(date, env) {
    try {
      // Get puzzle ID first
      const puzzleData = await env.DB.prepare(`
        SELECT puzzle_id FROM puzzles WHERE date = ?
      `).bind(date).first();
      
      if (!puzzleData) {
        return errorResponse(`No puzzle found for date: ${date}`, 404);
      }
      
      // Get all clues for this puzzle
      const clues = await env.DB.prepare(`
        SELECT * FROM clues 
        WHERE puzzle_id = ? 
        ORDER BY 
          CASE direction 
            WHEN 'across' THEN 0 
            WHEN 'down' THEN 1 
            ELSE 2 
          END, 
          number
      `).bind(puzzleData.puzzle_id).all();
      
      // Format response
      const result = {
        date: date,
        clues: clues.results,
        across: clues.results.filter(c => c.direction === 'across'),
        down: clues.results.filter(c => c.direction === 'down')
      };
      
      // Remove sensitive fields before returning
      return successResponse(removeSensitiveFields(result));
    } catch (error) {
      return errorResponse(`Database error: ${error.message}`, 500);
    }
  }
  
  // Search for clues by answer
  async function searchByAnswer(answer, env) {
    try {
      // Use UPPER to make search case-insensitive
      const clues = await env.DB.prepare(`
        SELECT c.*, p.date, p.formatted_date, p.day_of_week, p.title
        FROM clues c
        JOIN puzzles p ON c.puzzle_id = p.puzzle_id
        WHERE UPPER(c.answer) = UPPER(?)
        ORDER BY p.date DESC
      `).bind(answer.toUpperCase()).all();
      
      if (!clues.results || clues.results.length === 0) {
        return errorResponse(`No clues found with answer: ${answer}`, 404);
      }
      
      // Remove sensitive fields before returning
      return successResponse(removeSensitiveFields(clues.results));
    } catch (error) {
      return errorResponse(`Database error: ${error.message}`, 500);
    }
  }
  
  // Search for answers by clue text
  async function searchByClueText(clueText, env) {
    try {
      // Check if the search text is likely to cause pattern complexity issues
      if (clueText.length > 30) {
        // For longer search strings, break into multiple words and use SQL AND logic
        // This avoids the pattern complexity issue while still using the database index
        const words = clueText.split(/\s+/).filter(word => word.length > 2);
        
        // Start with a base query
        let query = `
          SELECT c.*, p.date, p.formatted_date, p.day_of_week, p.title
          FROM clues c
          JOIN puzzles p ON c.puzzle_id = p.puzzle_id
          WHERE 1=1
        `;
        
        // Add a condition for each word
        const params = [];
        for (let i = 0; i < words.length; i++) {
          // Skip very common words that might cause too many matches
          if (['the', 'and', 'for', 'with', 'that', 'this', 'from'].includes(words[i].toLowerCase())) {
            continue;
          }
          query += ` AND c.clue_text LIKE ?`;
          params.push(`%${words[i]}%`);
          
          // Limit to 5 words to avoid too many parameters
          if (i >= 4) break;
        }
        
        query += ` ORDER BY p.date DESC LIMIT 50`;
        
        // Execute the query
        const clues = await env.DB.prepare(query).bind(...params).all();
        
        if (!clues.results || clues.results.length === 0) {
          return errorResponse(`No clues found matching text: ${clueText}`, 404);
        }
        
        // Now filter the results to ensure they match the full search term more closely
        const searchTermLower = clueText.toLowerCase();
        const filteredResults = clues.results.filter(clue => 
          clue.clue_text.toLowerCase().includes(searchTermLower)
        );
        
        if (filteredResults.length === 0) {
          // If strict filtering removed all results, return the original SQL results
          return successResponse(removeSensitiveFields(clues.results));
        }
        
        // Remove sensitive fields before returning
        return successResponse(removeSensitiveFields(filteredResults));
      } else {
        // For shorter strings, use the original LIKE approach
        const searchTerm = `%${clueText}%`;
        
        const clues = await env.DB.prepare(`
          SELECT c.*, p.date, p.formatted_date, p.day_of_week, p.title
          FROM clues c
          JOIN puzzles p ON c.puzzle_id = p.puzzle_id
          WHERE c.clue_text LIKE ?
          ORDER BY p.date DESC
          LIMIT 50
        `).bind(searchTerm).all();
        
        if (!clues.results || clues.results.length === 0) {
          return errorResponse(`No clues found matching text: ${clueText}`, 404);
        }
        
        // Remove sensitive fields before returning
        return successResponse(removeSensitiveFields(clues.results));
      }
    } catch (error) {
      return errorResponse(`Database error: ${error.message}`, 500);
    }
  }
  
  // Get all related clues for a specific answer
  async function getRelatedClues(answer, env) {
    try {
      // Gather related information - all clues with the same answer
      const clues = await env.DB.prepare(`
        SELECT c.*, p.date, p.formatted_date, p.day_of_week, p.title
        FROM clues c
        JOIN puzzles p ON c.puzzle_id = p.puzzle_id
        WHERE UPPER(c.answer) = UPPER(?)
        ORDER BY p.date DESC
      `).bind(answer.toUpperCase()).all();
      
      if (!clues.results || clues.results.length === 0) {
        return errorResponse(`No related clues found for answer: ${answer}`, 404);
      }
      
      // Group clues by date to show other clues from the same puzzle
      const cluesByDate = {};
      for (const clue of clues.results) {
        if (!cluesByDate[clue.date]) {
          // Get all clues from the same puzzle date
          const puzzleClues = await env.DB.prepare(`
            SELECT c.*
            FROM clues c
            JOIN puzzles p ON c.puzzle_id = p.puzzle_id
            WHERE p.date = ?
            ORDER BY 
              CASE c.direction 
                WHEN 'across' THEN 0 
                WHEN 'down' THEN 1 
                ELSE 2 
              END, 
              c.number
          `).bind(clue.date).all();
          
          cluesByDate[clue.date] = {
            date: clue.date,
            formatted_date: clue.formatted_date,
            day_of_week: clue.day_of_week,
            title: clue.title,
            clues: puzzleClues.results
          };
        }
      }
      
      const response = {
        answer: answer,
        occurrences: clues.results.length,
        appearances: Object.values(cluesByDate)
      };
      
      // Remove sensitive fields before returning
      return successResponse(removeSensitiveFields(response));
    } catch (error) {
      return errorResponse(`Database error: ${error.message}`, 500);
    }
  }
  
  // NEW: Fetch and scrape puzzle data from XWordInfo
  async function scrapePuzzleData(date) {
    // Format the date for the URL (YYYY-MM-DD to MM/DD/YYYY)
    const [year, month, day] = date.split('-');
    const formattedDate = `${month}/${day}/${year}`;
    const url = `https://www.xwordinfo.com/Crossword?date=${formattedDate}`;
    
    console.log(`Fetching puzzle data from ${url}`);
    
    try {
      // Fetch the page
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch puzzle data: ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Check if page has actual content
      if (!html.includes("XWord Info Home")) {
        throw new Error("Invalid or empty page content");
      }
      
      // Parse HTML to extract puzzle data
      const puzzle = {
        date: date,
        formatted_date: getFormattedDate(date),
        day_of_week: getDayOfWeek(date),
        title: '',
        author: '',
        editor: '',
        permalink: url,
        clues: []
      };
      
      // Extract title (puzzle date line)
      const titleMatch = html.match(/<h1 id="PuzTitle">([\s\S]*?)<\/h1>/i);
      if (titleMatch && titleMatch[1]) {
        puzzle.title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
      }
      
      // Extract author and editor
      const authorRegex = /<div>Author:<\/div>\s*<div>([^<]+)<\/div>/i;
      const authorMatch = html.match(authorRegex);
      if (authorMatch && authorMatch[1]) {
        puzzle.author = authorMatch[1].trim();
      }
      
      const editorRegex = /<div>Editor:<\/div>\s*<div>([^<]+)<\/div>/i;
      const editorMatch = html.match(editorRegex);
      if (editorMatch && editorMatch[1]) {
        puzzle.editor = editorMatch[1].trim();
      }
      
      // Parse Across Clues - using the specific structure from newresponse.html
      let acrossClues = [];
      let downClues = [];
      
      // This pattern looks for the across clues section
      const acrossCluePattern = /<div id="ACluesPan">([\s\S]*?)<div id="DCluesPan">/i;
      const acrossSection = html.match(acrossCluePattern);
      
      if (acrossSection && acrossSection[1]) {
        // Revised pattern that better matches the clue format
        const numCluePattern = /<div>(\d+)<\/div>\s*<div>([^:]+):\s*<a href="\/Finder\?w=([^"]+)">([^<]+)<\/a>/g;
        let match;
        
        // Use exec to iterate through all matches
        while ((match = numCluePattern.exec(acrossSection[1])) !== null) {
          if (match.length >= 5) {
            const number = parseInt(match[1], 10);
            const clueText = cleanClueText(match[2]);
            const answer = match[4].trim();
            
            acrossClues.push({
              number: number,
              clue: clueText,
              answer: answer,
              direction: 'across'
            });
          }
        }
  
        // If the first pattern doesn't find all clues, try a more general pattern
        if (acrossClues.length < 10) {
          const clueItems = acrossSection[1].match(/<div>(\d+)<\/div>\s*<div>([\s\S]*?)<\/div>/g);
          
          if (clueItems && clueItems.length > 0) {
            acrossClues = [];
            for (let i = 0; i < clueItems.length; i += 2) {
              if (i + 1 < clueItems.length) {
                const numMatch = clueItems[i].match(/<div>(\d+)<\/div>/);
                let clueHtml = clueItems[i + 1];
                
                if (numMatch && numMatch[1]) {
                  const number = parseInt(numMatch[1], 10);
                  
                  // Extract the clue text and answer
                  const clueAnswerMatch = clueHtml.match(/<div>(.*?):\s*<a[^>]*>([^<]+)<\/a>/);
                  
                  if (clueAnswerMatch && clueAnswerMatch.length >= 3) {
                    const clueText = cleanClueText(clueAnswerMatch[1].trim());
                    const answer = clueAnswerMatch[2].trim();
                    
                    acrossClues.push({
                      number: number,
                      clue: clueText,
                      answer: answer,
                      direction: 'across'
                    });
                  }
                }
              }
            }
          }
        }
      }
      
      // Parse Down Clues - using the same approach
      const downCluePattern = /<div id="DCluesPan">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i;
      const downSection = html.match(downCluePattern);
      
      if (downSection && downSection[1]) {
        // Start with the same pattern as for across clues
        const numCluePattern = /<div>(\d+)<\/div>\s*<div>([^:]+):\s*<a href="\/Finder\?w=([^"]+)">([^<]+)<\/a>/g;
        let match;
        
        // Use exec to iterate through all matches
        while ((match = numCluePattern.exec(downSection[1])) !== null) {
          if (match.length >= 5) {
            const number = parseInt(match[1], 10);
            const clueText = cleanClueText(match[2]);
            const answer = match[4].trim();
            
            downClues.push({
              number: number,
              clue: clueText,
              answer: answer,
              direction: 'down'
            });
          }
        }
  
        // If the first pattern doesn't find all clues, try a more general pattern
        if (downClues.length < 10) {
          const clueItems = downSection[1].match(/<div>(\d+)<\/div>\s*<div>([\s\S]*?)<\/div>/g);
          
          if (clueItems && clueItems.length > 0) {
            downClues = [];
            for (let i = 0; i < clueItems.length; i += 2) {
              if (i + 1 < clueItems.length) {
                const numMatch = clueItems[i].match(/<div>(\d+)<\/div>/);
                let clueHtml = clueItems[i + 1];
                
                if (numMatch && numMatch[1]) {
                  const number = parseInt(numMatch[1], 10);
                  
                  // Extract the clue text and answer
                  const clueAnswerMatch = clueHtml.match(/<div>(.*?):\s*<a[^>]*>([^<]+)<\/a>/);
                  
                  if (clueAnswerMatch && clueAnswerMatch.length >= 3) {
                    const clueText = cleanClueText(clueAnswerMatch[1].trim());
                    const answer = clueAnswerMatch[2].trim();
                    
                    downClues.push({
                      number: number,
                      clue: clueText,
                      answer: answer,
                      direction: 'down'
                    });
                  }
                }
              }
            }
          }
        }
      }
      
      // If we still have issues, try a different approach based on the HTML structure in newresponse.html
      if (acrossClues.length < 10 || downClues.length < 10) {
        console.log("Using alternative parsing method for clues");
        
        // Look for the clue sections with class numclue
        const numCluePattern = /<div class="numclue">([\s\S]*?)<\/div>/g;
        let clueSections = [];
        let match;
        
        while ((match = numCluePattern.exec(html)) !== null) {
          clueSections.push(match[1]);
        }
        
        // If we found clue sections
        if (clueSections.length >= 2) {
          // First section is across clues
          const acrossSection = clueSections[0];
          // Parse all clue entries
          const clueEntryPattern = /<div>(\d+)<\/div>\s*<div>([^<]*?)\s*:\s*<a href="\/Finder\?w=([^"]+)">([^<]+)<\/a>/g;
          
          // Reset across clues if we're using this alternative method
          acrossClues = [];
          
          while ((match = clueEntryPattern.exec(acrossSection)) !== null) {
            if (match.length >= 5) {
              const number = parseInt(match[1], 10);
              // Clean the clue text
              let clueText = match[2].trim();
              // Fix HTML entities
              clueText = cleanClueText(clueText);
              
              const answer = match[4].trim();
              
              acrossClues.push({
                number: number,
                clue: clueText,
                answer: answer,
                direction: 'across'
              });
            }
          }
          
          // Second section is down clues
          const downSection = clueSections[1];
          // Reset down clues
          downClues = [];
          
          // Reset the pattern's lastIndex to start from the beginning
          clueEntryPattern.lastIndex = 0;
          
          while ((match = clueEntryPattern.exec(downSection)) !== null) {
            if (match.length >= 5) {
              const number = parseInt(match[1], 10);
              // Clean the clue text
              let clueText = match[2].trim();
              // Fix HTML entities
              clueText = cleanClueText(clueText);
              
              const answer = match[4].trim();
              
              downClues.push({
                number: number,
                clue: clueText,
                answer: answer,
                direction: 'down'
              });
            }
          }
        }
      }
      
      // Combine the clues
      puzzle.clues = [...acrossClues, ...downClues];
      
      // Log the results
      console.log(`Scraped puzzle for ${date}: ${puzzle.title}`);
      console.log(`Found ${acrossClues.length} across clues and ${downClues.length} down clues`);
      
      // Validate the data
      if (puzzle.clues.length === 0) {
        throw new Error(`No clues found in the puzzle data for ${date}`);
      }
      
      return puzzle;
    } catch (error) {
      console.error(`Error scraping puzzle data for ${date}:`, error);
      return null;
    }
  }
  
  // NEW: Save puzzle data to the database
  async function savePuzzleToDatabase(puzzle, env) {
    try {
      // Begin a transaction
      const insertPuzzle = env.DB.prepare(`
        INSERT INTO puzzles (date, formatted_date, title, author, editor, day_of_week, permalink)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (date) DO UPDATE SET
          formatted_date = excluded.formatted_date,
          title = excluded.title,
          author = excluded.author,
          editor = excluded.editor,
          day_of_week = excluded.day_of_week,
          permalink = excluded.permalink
      `);
      
      const result = await insertPuzzle.bind(
        puzzle.date,
        puzzle.formatted_date,
        puzzle.title,
        puzzle.author,
        puzzle.editor,
        puzzle.day_of_week,
        puzzle.permalink
      ).run();
      
      // Get the puzzle ID
      let puzzleId;
      if (result.changes > 0) {
        // If we inserted a new puzzle, get the last ID
        const getLastId = await env.DB.prepare('SELECT last_insert_rowid() as id').first();
        puzzleId = getLastId.id;
      } else {
        // If we updated an existing puzzle, get its ID
        const getPuzzleId = await env.DB.prepare('SELECT puzzle_id FROM puzzles WHERE date = ?').bind(puzzle.date).first();
        puzzleId = getPuzzleId.puzzle_id;
        
        // Delete existing clues for this puzzle
        await env.DB.prepare('DELETE FROM clues WHERE puzzle_id = ?').bind(puzzleId).run();
      }
      
      // Insert clues one by one instead of using batch
      for (const clue of puzzle.clues) {
        await env.DB.prepare(`
          INSERT INTO clues (puzzle_id, number, direction, clue_text, answer)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          puzzleId,
          clue.number,
          clue.direction,
          clue.clue,
          clue.answer
        ).run();
      }
      
      return {
        puzzle_id: puzzleId,
        date: puzzle.date,
        clue_count: puzzle.clues.length,
        is_new: result.changes > 0
      };
    } catch (error) {
      console.error("Error saving puzzle data:", error);
      throw error;
    }
  }
  
  // NEW: Check if puzzle exists for a date
  async function puzzleExists(date, env) {
    try {
      const result = await env.DB.prepare('SELECT 1 FROM puzzles WHERE date = ?').bind(date).first();
      return !!result;
    } catch (error) {
      console.error(`Error checking if puzzle exists for ${date}:`, error);
      return false;
    }
  }
  
  // NEW: Fetch and add a puzzle for a specific date
  async function fetchAndAddPuzzle(date, env) {
    try {
      // Validate date format
      if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return errorResponse("Invalid date format. Please use YYYY-MM-DD format.");
      }
      
      // Check if puzzle already exists
      const exists = await puzzleExists(date, env);
      if (exists) {
        return successResponse({
          message: `Puzzle for ${date} already exists in the database.`,
          date: date,
          updated: false
        });
      }
      
      // Fetch puzzle data
      console.log(`Fetching puzzle data for ${date}`);
      const puzzleData = await scrapePuzzleData(date);
      
      if (!puzzleData) {
        return errorResponse(`Failed to fetch puzzle data for ${date}. The puzzle may not exist.`, 404);
      }
      
      if (!puzzleData.clues || puzzleData.clues.length === 0) {
        return errorResponse(`Puzzle for ${date} has no clues. The puzzle may not be available yet.`, 404);
      }
      
      // Save to database
      const result = await savePuzzleToDatabase(puzzleData, env);
      
      // Also update the today.json file on GitHub
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      if (date === todayStr) {
        try {
          const todayJson = {
            puzzle: {
              date: puzzleData.date,
              formatted_date: puzzleData.formatted_date,
              day_of_week: puzzleData.day_of_week,
              title: puzzleData.title,
              author: puzzleData.author,
              editor: puzzleData.editor,
              permalink: puzzleData.permalink
            },
            clues: puzzleData.clues,
            across: puzzleData.clues.filter(c => c.direction === 'across'),
            down: puzzleData.clues.filter(c => c.direction === 'down')
          };

          await updateGithubFile(
            'public/today.json',
            JSON.stringify(todayJson, null, 2),
            `feat: Update today's puzzle for ${date}`,
            env
          );
        } catch (e) {
          console.error(`Failed to update today.json on GitHub: ${e.message}`);
        }
      }
      
      return successResponse({
        message: `Successfully added puzzle for ${date} with ${result.clue_count} clues.`,
        date: date,
        puzzle_id: result.puzzle_id,
        clue_count: result.clue_count,
        updated: true
      });
    } catch (error) {
      console.error(`Error fetching puzzle for ${date}:`, error);
      return errorResponse(`Error fetching puzzle: ${error.message}`, 500);
    }
  }
  
  // NEW: Fetch today's or latest available puzzle
  async function fetchAndAddLatestPuzzle(env) {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      console.log(`Checking for latest puzzle on ${todayStr}.`);
      
      let puzzleDataForJson;
      let message;
      let updatedDb = false;

      // Try to get puzzle from DB first
      puzzleDataForJson = await getRawPuzzleDataByDate(todayStr, env);
      
      if (puzzleDataForJson) {
        // Puzzle is already in the database.
        message = "Today's puzzle is already in the database.";
        console.log(message);
      } else {
        // Puzzle not in DB, so scrape it
        console.log(`Puzzle for ${todayStr} not in DB. Attempting to fetch from source.`);
        const scrapedData = await scrapePuzzleData(todayStr);
      
        if (!scrapedData || !scrapedData.clues || scrapedData.clues.length === 0) {
        return successResponse({
            message: `No new puzzle available to scrape for today (${todayStr}) yet.`,
          date: todayStr,
          updated: false
        });
      }
      
      // Save to database
        const result = await savePuzzleToDatabase(scrapedData, env);
        updatedDb = true;
        
        // Structure the scraped data to match the format for our JSON file
        puzzleDataForJson = {
          puzzle: {
            date: scrapedData.date,
            formatted_date: scrapedData.formatted_date,
            day_of_week: scrapedData.day_of_week,
            title: scrapedData.title,
            author: scrapedData.author,
            editor: scrapedData.editor,
            permalink: scrapedData.permalink
          },
          clues: scrapedData.clues,
          across: scrapedData.clues.filter(c => c.direction === 'across'),
          down: scrapedData.clues.filter(c => c.direction === 'down')
        };
        
        message = `Successfully added puzzle for ${todayStr} with ${result.clue_count} clues.`;
      }
      
      // At this point, we must have puzzle data to commit.
      if (!puzzleDataForJson) {
         return errorResponse(`Could not retrieve puzzle data for ${todayStr} for GitHub update.`, 500);
      }
      
      // Always update today.json on GitHub
      try {
        await updateGithubFile(
          'public/today.json',
          JSON.stringify(puzzleDataForJson, null, 2),
          `feat: Update puzzle for ${todayStr}`,
          env
        );
        message += " GitHub file updated.";
      } catch (e) {
        console.error(`Failed to update today.json on GitHub: ${e.message}`);
        message += ` Failed to update GitHub file: ${e.message}`;
      }
      
      return successResponse({
        message: message,
        date: todayStr,
        updated: updatedDb
      });
    } catch (error) {
      return errorResponse(`Error fetching latest puzzle: ${error.message}`, 500);
    }
  }
  
  // NEW: Function to delete a puzzle by date
  async function deletePuzzleByDate(date, env) {
    try {
      // First, check if puzzle exists
      const puzzleData = await env.DB.prepare(`
        SELECT puzzle_id FROM puzzles WHERE date = ?
      `).bind(date).first();
      
      if (!puzzleData) {
        return errorResponse(`No puzzle found for date: ${date}`, 404);
      }
      
      const puzzleId = puzzleData.puzzle_id;
      
      // Begin a transaction to ensure atomic operation
      // Delete the clues first (foreign key constraint)
      const deleteCluesResult = await env.DB.prepare(`
        DELETE FROM clues WHERE puzzle_id = ?
      `).bind(puzzleId).run();
      
      // Then delete the puzzle
      const deletePuzzleResult = await env.DB.prepare(`
        DELETE FROM puzzles WHERE puzzle_id = ?
      `).bind(puzzleId).run();
      
      // If deleting today's puzzle, clear today.json
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      if (date === todayStr) {
        try {
          await updateGithubFile(
            'public/today.json',
            JSON.stringify({ "cleared": true, "date": date }, null, 2),
            `feat: Clear today's puzzle for ${date}`,
            env
          );
        } catch (e) {
          console.error(`Failed to clear today.json on GitHub: ${e.message}`);
        }
      }
      
      return successResponse({
        message: `Successfully deleted puzzle for ${date}`,
        date: date,
        clues_deleted: deleteCluesResult.changes,
        puzzle_deleted: deletePuzzleResult.changes
      });
    } catch (error) {
      console.error(`Error deleting puzzle for ${date}:`, error);
      return errorResponse(`Database error: ${error.message}`, 500);
    }
  }
  
  // NEW: Function to update a file on GitHub
  async function updateGithubFile(filePath, content, message, env) {
    // Get GitHub details from environment variables
    const repoLink = env.GITHUB_REPO_LINK;
    const token = env.GITHUB_TOKEN;
    const branch = 'main'; // Defaulting to main as requested
  
    // Check if required environment variables are set
    if (!repoLink || !token) {
      console.error('GitHub environment variables (GITHUB_REPO_LINK, GITHUB_TOKEN) are not set. Skipping file update.');
      return;
    }
  
    // Parse owner and repo from the link
    let owner, repo;
    try {
      const url = new URL(repoLink);
      // Ensure it's a github.com URL
      if (url.hostname !== 'github.com') {
        throw new Error('Repository link must be a valid github.com URL.');
      }
      const pathParts = url.pathname.split('/').filter(part => part.length > 0);
      if (pathParts.length < 2) {
        throw new Error('Invalid GitHub repository URL format.');
      }
      [owner, repo] = pathParts;
    } catch (e) {
      console.error(`Invalid GITHUB_REPO_LINK: ${e.message}. Expected format: https://github.com/owner/repo`);
      return;
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    
    // Set up headers for GitHub API
    const headers = {
      'Authorization': `token ${token}`,
      'User-Agent': 'Cloudflare-Worker-Crossword-Archive',
      'Accept': 'application/vnd.github.v3+json'
    };
  
    try {
      // First, try to get the file to see if it exists and get its SHA
      let fileSha = null;
      const getResponse = await fetch(url, { headers: headers });
      
      if (getResponse.ok) {
        const fileData = await getResponse.json();
        fileSha = fileData.sha;
      } else if (getResponse.status !== 404) {
        // If the status is not 404, it's an actual error
        throw new Error(`Failed to get file from GitHub: ${getResponse.status} ${await getResponse.text()}`);
      }
  
      // Base64 encode the content. Handles Unicode characters correctly.
      const encodedContent = btoa(unescape(encodeURIComponent(content)));
  
      // If the SHA is available and the new content is the same, skip updating
      if (fileSha) {
        const existingContentResponse = await fetch(url + '?ref=' + branch, { headers });
        if (existingContentResponse.ok) {
          const existingFileData = await existingContentResponse.json();
          // The content from GitHub API is base64 encoded and has newlines.
          if (existingFileData.content.replace(/\n/g, '') === encodedContent) {
            console.log(`Content of ${filePath} is already up-to-date. Skipping update.`);
            return;
          }
        }
      }

      // Prepare the request body for creating or updating the file
      const body = {
        message: message,
        content: encodedContent,
        branch: branch
      };
  
      // If we have a SHA, it means we are updating an existing file
      if (fileSha) {
        body.sha = fileSha;
      }
  
      // Make the PUT request to create or update the file
      const putResponse = await fetch(url, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
  
      if (!putResponse.ok) {
        throw new Error(`Failed to update file on GitHub: ${putResponse.status} ${await putResponse.text()}`);
      }
  
      const responseData = await putResponse.json();
      console.log(`Successfully updated ${filePath} on GitHub. Commit SHA: ${responseData.commit.sha}`);
      return responseData;
  
    } catch (error) {
      console.error('Error updating GitHub file:', error);
      // We log the error but don't re-throw, so it doesn't fail the entire worker operation
    }
  }
  
  // Main event handler
  export default {
    async fetch(request, env, ctx) {
      return handleRequest(request, env);
    },
    
    // NEW: Scheduled event handler for automatic updates
    async scheduled(event, env, ctx) {
      // This will be triggered on the schedule defined in wrangler.toml
      console.log(`Running scheduled update at ${new Date().toISOString()}`);
      try {
        const result = await fetchAndAddLatestPuzzle(env);
        console.log("Scheduled update result:", JSON.stringify(result));
        return result;
      } catch (error) {
        console.error("Error in scheduled update:", error);
        return errorResponse(`Scheduled update failed: ${error.message}`, 500);
      }
    }
  }; 