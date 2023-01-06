use std::convert::Infallible;
use std::net::SocketAddr;

use http_body_util::Full;
use hyper::body::Bytes;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};
use tokio::net::TcpListener;

fn hello_world(
    _req: http::Request<hyper::body::Incoming>,
) -> http::Result<hyper::Response<http_body_util::Full<hyper::body::Bytes>>> {
    http::Response::builder()
        .header(
            http::header::CONTENT_TYPE,
            http::header::HeaderValue::from_static("text/html"),
        )
        .body(http_body_util::Full::from(format!(
            "<!doctype html>
<html lang=\"ja\">

<head>
<meta charset=\"utf-8\">
<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">
<style>
body {{
    font-size: 48px;
    color: white;
    background-color: black;
}}
</style>
</head>

<body>
  <div>Rust のサーバーを起動できた!</div>
  <div>現在の時刻 {}</div>
  <div>ランダム {}</div>
</body>

</html>
",
            chrono::Utc::now(),
            uuid::Uuid::new_v4()
        )))
}

#[tokio::main]
async fn main() {
    let port_number = get_port_number_from_env_variable();
    let address = std::net::SocketAddr::from(([0, 0, 0, 0], port_number));

    let listener = tokio::net::TcpListener::bind(address).await.expect("tcp 接続を確立できなかった");

    loop {
        let (stream, _) = listener.accept().await.expect("tcp のストリーム読み取り時にエラー");

        // Spawn a tokio task to serve multiple connections concurrently
        tokio::task::spawn(async move {
            // Finally, we bind the incoming connection to our `hello` service
            if let Err(err) = http1::Builder::new()
                // `service_fn` converts our function in a `Service`
                .serve_connection(stream, service_fn(hello_world))
                .await
            {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}

/// ポート番号を PORT という名前の環境変数から呼んで返す. 環境変数がなければ デフォルトで 3000 を返す
/// これは Cloud Run で動かすときに必要になる
fn get_port_number_from_env_variable() -> u16 {
    let port_env = std::env::var("PORT");
    const DEFAULT_PORT_NUMBER: u16 = 3000;
    match port_env {
        Ok(port_env_as_string) => match std::str::FromStr::from_str(&port_env_as_string) {
            Ok(port_env_as_int) => port_env_as_int,
            Err(e) => {
                println!("PORT の 環境変数を見つけることができたが数値として読み取れんかなった PORT={} ParseIntError={}", port_env_as_string, e);
                DEFAULT_PORT_NUMBER
            }
        },
        Err(e) => {
            println!("PORT の 環境変数がなかった. VarError={}", e);
            DEFAULT_PORT_NUMBER
        }
    }
}
