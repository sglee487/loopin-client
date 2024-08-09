// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use std::process::Command;

#[tauri::command]
fn open_in_default_browser(url: &str) {
    if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(&["/C", "start", url])
            .spawn()
            .expect("failed to open default browser");
    } else if cfg!(target_os = "macos") {
        Command::new("open")
            .arg(url)
            .spawn()
            .expect("failed to open default browser");
    } else if cfg!(target_os = "linux") {
        Command::new("xdg-open")
            .arg(url)
            .spawn()
            .expect("failed to open default browser");
    } else {
        eprintln!("Unsupported OS");
    }
}

#[tauri::command]
fn get_env(name: &str) -> String {
    std::env::var(String::from(name)).unwrap_or(String::from(""))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let env = include_str!("../../.env");
    // println!("prod_env {}", prod_env);
    let result = dotenv::from_read(env.as_bytes()).unwrap();
    result.load();
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            open_in_default_browser,
            get_env
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
