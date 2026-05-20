
import {convert} from 'html-to-text'; 
import { OpenUrlOutputSchema } from './schemas';

// In an AI agent, openUrl logic usually means:

// “Fetch and read the actual webpage content from a URL so the agent can understand it.”

// Search APIs normally return only:

// title
// url
// snippet

// But snippets are often too small.
// So agents use openUrl() to:

// open the page
// extract readable content
// send that content to the LLM

//lm cant direcly browse the web but it can read and understand the content of a webpage if 
// we fetch it and send it to the model. This is what openUrl logic does in an AI agent. It allows 
// the agent to access and comprehend information from the web, which can be crucial for tasks that 
// require up-to-date or specific information that may not be included in the model's training data.


//we fetch the url and stripe all the unneceassry infos and keep the exact articlle like content that we need

// next file - summarize.ts

export async function openurl(url:string){
       //step 1 : normalize  the url 
       const normalize=validateUrls(url);

      //step 2 : fetch the page from the content (since llms cant directly browse the web we need)

      const res= await fetch(normalize,{
        headers:{
            'User-Agent':'agent-core/1.0 (+course demo)'
        }
      })

      if(!res.ok){
        const body = await safeText(res);
        throw new Error(`Failed to fetch URL: ${res.status} - ${body.slice(0,200)}`);
      }

      //step 3 : read the response body and detect the type of content (html, json, text)
      const contentType = res.headers.get("content-type") || "";
      const raw=await res.text();

      //step 4 : convert html to normal text
      const text = contentType.includes("text/html")?
      convert(raw ,{
         wordwrap:false,
         selectors: [
            {
                selector:'nav',format:'skip'
            },
            {
                selector:'header',format:'skip'
            },
            {
                selector:'footer',format:'skip'
            },
            {
                selector:'script',format:'skip'
            },
            {
                selector:'style',format:'skip'
            }
         ]
      }) : raw;

      //step 5 : normalize and limit the length of the text to 5000 characters
      const cleaned = collapseWhitespace(text)
      const capped=cleaned.slice(0,5000);

      //step 6: return the url and the cleaned content
      return OpenUrlOutputSchema.parse({
        url:normalize,
        content:capped
      })

        
}

function validateUrls(url:string){
    try{
        const parsed = new URL(url); 
        if(!/^https?:/.test(parsed.protocol)){
            throw new Error("only http and https protocols are allowed");
        }

        return parsed.toString();
    }
    catch{
      throw new Error("Invalid URL");
    }
}

 async function safeText(res: Response) {
        try {
            return await res.json()
        } catch {
            return "<no body>"
        }
    }

function collapseWhitespace(str:string){
    return str.replace(/\s+/g,' ').trim();
}