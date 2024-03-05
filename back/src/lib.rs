use openai_api_rs::v1::api::Client;
use openai_api_rs::v1::chat_completion::{self, ChatCompletionRequest};
use openai_api_rs::v1::common::GPT3_5_TURBO;
use std::env;

pub fn generate_text_ja(prompt: &str) -> String {
  setting(prompt, "日本語")
}

pub fn generate_text_en(prompt: &str) -> String {
  setting(prompt, "英語")
}

fn setting(prompt: &str, lang: &str ) -> String {
  let client = Client::new(env::var("OPENAI_API_KEY").unwrap().to_string());
  let req = ChatCompletionRequest::new(
    GPT3_5_TURBO.to_string(),
    vec![
      chat_completion::ChatCompletionMessage {
        role: chat_completion::MessageRole::system,
        content: chat_completion::Content::Text(format!("あなたはタイピングゲームのテキストを生成します。文章はお題の{}に沿って10個生成します。文章は{}で生成してください" ,prompt ,lang )),
        name: None,
      },
      chat_completion::ChatCompletionMessage {
        role: chat_completion::MessageRole::user,
        content: chat_completion::Content::Text(format!("{}に沿った文章を生成してください。必ず文章と文章の間は半角スペースで表してください。文章には鉤括弧、順番を表す数字などの要素はつけないでください。", prompt)),
        name: None,
    }],
  );
  

  let result = client.chat_completion(req).unwrap();
  result.choices[0].message.content.as_ref().unwrap().to_string()
}