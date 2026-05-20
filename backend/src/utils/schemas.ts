//legal contract between backend -> ai models -> frontend

import { z } from "zod"

// //Now the model gets:

// predictable structure
// smaller context
// easier parsing
// less reasoning overhead

// So cost reduces because:

// Fewer tokens
// Structured JSON is shorter than natural language explanations.
// Less reprocessing
// Agent doesn’t need another LLM call to “clean” the output.
// Fewer failures/retries
// Tools returning validated schema reduce parsing errors.
// Better tool chaining
// One tool’s output can directly become another tool’s input.
// Smaller prompts
// You can say:


export const WebSearchResultSchema = z.object({
    title:z.string().min(1),
    url:z.string(),
    snippet:z.string().optional().default("")
})

// If search returns 50 results:

// huge context
// more tokens
// slower inference
// higher API cost

// Limiting to 5 keeps prompts smaller.

export const WebSearchResultsSchema = z.array(WebSearchResultSchema).max(5) 

export type WebSearchResult = z.infer<typeof WebSearchResultSchema>



//see the openurl.ts to see its usage 
export const OpenUrlInputSchema=z.object({
    url:z.url(),

})

export const OpenUrlOutputSchema=z.object({
    url:z.url(),
    content:z.string().min(1),
    
})


//schema for summarize input and output 

export const summarizeInputSchema=z.object({
    text:z.string().min(50,'need a bit more text to summarize')
})

export const summarizeOutputSchema=z.object({
    summary:z.string().min(1)
})


//search input schema

export const searchInputSchema=z.object({
    q:z.string().min(2,'Please ask a specific query')

})

export type SearchInput=z.infer<typeof searchInputSchema>