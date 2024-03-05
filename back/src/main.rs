use back::{generate_text_ja, generate_text_en};
use actix_cors::Cors;
use actix_web::{get, http, web, App, HttpServer, Responder};


#[get("/text/japanese/{prompt}")]
async fn get_text_ja(prompt: web::Path<String>) -> impl Responder {
    let text = generate_text_ja(prompt.as_str());
    format!("{}",text)
}

#[get("/text/english/{prompt}")]
async fn get_text_en(prompt: web::Path<String>) -> impl Responder {
    let text = generate_text_en(prompt.as_str());
    format!("{}",text)
}

#[actix_web::main] // or #[tokio::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
      let cors = Cors::default()
      .allowed_origin("http://localhost:5173")
      .allowed_methods(vec!["GET", "POST"])
      .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
      .allowed_header(http::header::CONTENT_TYPE)
      .max_age(3600);

      App::new().wrap(cors).service(get_text_en).service(get_text_ja)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}