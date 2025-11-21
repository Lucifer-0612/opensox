import { SheetModule } from "./types";

export const module9: SheetModule = {
  id: "module-9",
  name: "Live fix of the issue - Part-1",
  docContent: `
      <h1>module 9: extending the browser-use contribution</h1>
      
      <p><strong>note:</strong> as this module is implementation focused, try watching the <a href="https://youtu.be/hRMtIB-pkeE" target="_blank" rel="noopener noreferrer" style="color: #9455f4; text-decoration: underline;">video</a> so that you can have better understanding.</p>
      
      <p>in this module we're continuing the contribution we started in module 8. in module 8 we began working on an issue in the browser-use repo, and here we'll extend that work.</p>
      
      <p><strong>note:</strong> if you haven't watched module 7 and module 8, you should do that first — otherwise nothing in this module will make sense.</p>
      
      <h3 style="margin-top: 40px; margin-bottom: 20px; color: #9455f4;">checking the issue status</h3>
      
      <p>so let's open the issue we were working on. it's already closed.</p>
      
      <p>four days ago, in module 8, we commented that we weren't able to reproduce the exact error described in the issue.</p>
      
      <p>now, someone else replied saying that when the error triggers, the whole system crashes and floods the terminal with a huge amount of errors, which makes it impossible to see the real root cause.</p>
      
      <p>he didn't attach screenshots, so we still didn't have full clarity.</p>
      
      <p>after that, the original issue creator replied and tagged me. he shared screenshots and explained the real behavior.</p>
      
      <h3 style="margin-top: 40px; margin-bottom: 20px; color: #9455f4;">understanding what the issue creator meant</h3>
      
      <p>the contributor said:</p>
      
      <p><em>when the deepseek model returns a response without the action field, the error is added to the agent history, but the LLM doesn't react to that error.</em></p>
      
      <p>so even if the agent says "hey deepseek, action field is missing", deepseek still keeps responding without the action field.</p>
      
      <p><strong>this creates a repeating loop of failures.</strong></p>
      
      <p>the contributor also fixed a local FILE-URL security issue for himself, but clarified that the core bug has nothing to do with files — it's purely about deepseek not returning the required field.</p>
      
      <p>he then shared screenshots showing:</p>
      
      <ul style="list-style: disc; padding-left: 24px; margin-top: 12px;">
        <li style="margin-bottom: 8px;">the schema has required fields: thinking, evaluation, previous_goal, memory, next_goal, action</li>
        <li style="margin-bottom: 8px;">deepseek returns everything except action</li>
        <li style="margin-bottom: 8px;">pydantic throws a validation error</li>
        <li style="margin-bottom: 8px;">agent retries, sends that error back</li>
        <li style="margin-bottom: 8px;">deepseek still doesn't fix itself</li>
        <li style="margin-bottom: 8px;">that means the failure multiplies</li>
      </ul>
      
      <p>this exactly matches what another commenter said earlier: <strong>multiple errors spam the terminal.</strong></p>
      
      <p>so now we finally understand the real root cause.</p>
      
      <h3 style="margin-top: 40px; margin-bottom: 20px; color: #9455f4;">reproducing the issue properly</h3>
      
      <p>since the real bug isn't tied to FILE-URL access or html parsing, we don't need to recreate the whole file scenario from module 8.</p>
      
      <p>the bug appears in any task as long as deepseek returns a response missing "action".</p>
      
      <p>we just need to run a task with deepseek, catch the output, and check agent history.</p>
      
      <p>the maintainer also pointed out where the missing check might live:</p>
      
      <p style="margin-left: 24px;"><code>browser_use.agent.service.Agent.get_model_output_with_retry()</code></p>
      
      <h3 style="margin-top: 40px; margin-bottom: 20px; color: #9455f4;">why the issue was closed without a PR</h3>
      
      <p>now the important part: <strong>why did the maintainer close the issue with no PR?</strong></p>
      
      <p>here's the maintainer's final comment:</p>
      
      <p style="margin-left: 24px;"><em>some models are unfortunately bad at obeying the structured output schema.</em></p>
      
      <p style="margin-left: 24px;"><em>we recommend using system_prompt_extension to explicitly describe the output format to the model.</em></p>
      
      <p><strong>in short:</strong></p>
      
      <ul style="list-style: disc; padding-left: 24px; margin-top: 12px;">
        <li style="margin-bottom: 8px;">deepseek simply doesn't follow the schema</li>
        <li style="margin-bottom: 8px;">so this isn't a browser-use bug, it's a model behavior problem</li>
      </ul>
      
      <p>the library already provides a built-in solution:</p>
      
      <p style="margin-left: 24px;"><strong>extend_system_message</strong> — a system-prompt extension that lets you explicitly tell the model how to format its output.</p>
      
      <p>so rather than patch browser-use for a model-specific issue, the correct fix is:</p>
      
      <p style="margin-left: 24px;">use the system prompt extension to force deepseek to follow the required schema.</p>
      
      <p><strong>that's why the maintainers didn't want a PR for this.</strong></p>
      
      <h3 style="margin-top: 40px; margin-bottom: 20px; color: #9455f4;">lessons from the PR attempt by someone else</h3>
      
      <p>another contributor opened a PR to "fix" this issue. the PR wasn't merged, and here are the mistakes worth learning from:</p>
      
      <ul style="list-style: none; padding-left: 0; margin-top: 12px;">
        <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">❌</span>
          <strong>didn't get maintainer approval first</strong> — always ask maintainers before fixing unclear issues
        </li>
        <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">❌</span>
          <strong>didn't fully understand the root cause</strong> — he attempted to fix a model-side issue at the agent level
        </li>
        <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">❌</span>
          <strong>didn't use proper PR formatting</strong> — he didn't use "fixes #&lt;issue-number&gt;" or "addresses #&lt;issue-number&gt;", so Github couldn't auto-close anything
        </li>
        <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">❌</span>
          <strong>no tests, no screenshots</strong> — always attach before/after results or output logs
        </li>
        <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">❌</span>
          <strong>poor commit messages</strong> — commit messages should follow good conventions like "fix: missing action field validation" instead of random unclear messages
        </li>
        <li style="margin-bottom: 12px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">❌</span>
          <strong>didn't sign the CLA</strong> — most OPEN SOURCE projects require this before merging
        </li>
      </ul>
      
      <p><strong>learning these early will save months of frustration.</strong></p>
      
      <h3 style="margin-top: 40px; margin-bottom: 20px; color: #9455f4;">what "system prompt extension" actually means</h3>
      
      <p><code>extend_system_message</code> lets you ADD extra instructions to the LLM without replacing the default system prompt.</p>
      
      <p><strong>example:</strong></p>
      
      <p style="margin-left: 24px;">tell the model explicitly — "always include an action field in your response."</p>
      
      <p>this is like the "additional note" option in food-delivery apps: the system already knows your order, but you add a custom instruction like "please bring cutlery" or "don't ring the bell".</p>
      
      <p>same vibe here.</p>
      
      <p>so instead of hacking the agent code, you use the built-in system message extension to guide the model.</p>
      
      <p><strong>problem solved.</strong></p>
      
      <h3 style="margin-top: 40px; margin-bottom: 20px; color: #9455f4;">the wrap-up</h3>
      
      <p>even though the issue got closed before we could raise a PR, we still learned a lot:</p>
      
      <ul style="list-style: none; padding-left: 0; margin-top: 12px;">
        <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">✓</span>
          how to reproduce bugs
        </li>
        <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">✓</span>
          how to interpret contributor comments
        </li>
        <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">✓</span>
          how agent history works
        </li>
        <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">✓</span>
          how retry loops create cascading failures
        </li>
        <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">✓</span>
          how to ask clarifying questions
        </li>
        <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">✓</span>
          how maintainers think about issues
        </li>
        <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">✓</span>
          how to avoid bad PR habits
        </li>
        <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
          <span style="position: absolute; left: 0;">✓</span>
          how the model vs agent boundary works
        </li>
      </ul>
      
      <p style="margin-top: 24px;">in the next module, we'll pick another issue — ideally one we can actually fix and raise a PR for.</p>
      
      <p>this is ajeetunc. see you in the next module.</p>
    `,
  videoUrl: "https://youtu.be/hRMtIB-pkeE",
  comingSoon: false,
};
