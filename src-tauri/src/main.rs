// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::Write;
use tauri_plugin_http::reqwest;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn download_video() {
    let res = reqwest::get("http://localhost:8080/video").await;

    let res = match res {
        Ok(res) => res,
        Err(error) => {
            panic!("Error: {:?}", error);
        }
    };

    println!("{:?}", &res.status());
    println!("{:?}", &res.headers());

    // save response to file
    let mut file = std::fs::File::create("video.mp4").unwrap();
    let content = &res.bytes().await.unwrap();
    file.write_all(&content).unwrap();

}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, download_video])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
