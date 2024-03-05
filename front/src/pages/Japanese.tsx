/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, ChangeEvent } from "react";
import Parser from "hiragana-romazi-parser";
import "../styles/Japanese.css"

async function fetch_text(prompt: string) {
  const response = await fetch(`http://127.0.0.1:8080/text/japanese/${prompt}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const data = await response.text();
  console.log(data);
  return data;
}
async function post_text(text: string) {
  const url = "https://jlp.yahooapis.jp/FuriganaService/V2/furigana?appid="+ encodeURIComponent(import.meta.env.VITE_CLIENT_ID || "");
  console.log(import.meta.env.REACT_APP_CLIENT_ID)
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
        "id": "A123",
        "jsonrpc" : "2.0",
        "method": 'jlp.maservice.parse',
        "params" : { "q" : text }
    }),
  });

  const data = await response.json();
  let hiragana_sen = "";
  data["result"]["tokens"].map((word: string) => hiragana_sen += word[1]);
  return hiragana_sen;
}

function Japanese() {
  const [text1, setText1] = useState<string[]>([""]);
  const [text2, setText2] = useState<string[]>([""]);
  const [isElected, setIsElected] = useState(false);
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(true);
  const sentenceJPRef = useRef(null);
  const hiraganaRef = useRef(null);
  const sentenceRef = useRef(null);
  const charCorrectRef = useRef(null);
  const charMissedRef = useRef(null);
  const sentenceCorrectRef = useRef(null);
  let data2: string[][];

  const handleThemeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value);
  }

  useEffect(() => {
    console.log(isElected)
    if(!isElected) return;
    const fetchText = async () => {
      console.log("fetching text"); 
      const data = await fetch_text(theme);
      const words = data.toString().split(" ");
      console.log(data);
      setText1(words);
      const hurigana = await post_text(data.toString()); //yahooAPI ひらがなにする
      setText2(hurigana.split(" "));
      setLoading(false);
    };
    fetchText();
  }, [isElected]);

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * text1.length); //ランダムな数字を生成
    const parser = new Parser();
    //最初は自分で文章をセットする必要がある
    if(loading || !isElected) return;
    parser.setData(text1, text2);
    if (sentenceJPRef.current) {
      (sentenceJPRef.current as HTMLDivElement).textContent = text1[randomNum]; //漢字の文章をセット
    }
    if (hiraganaRef.current) {
      (hiraganaRef.current as HTMLDivElement).textContent = text2[randomNum]; //ひらがなの文章をセット
    }
    if(sentenceRef.current){
      (sentenceRef.current as HTMLDivElement).textContent = ""; //漢字の文章をセット
      data2 = parser.build(text2[randomNum]);
    }
    if(charCorrectRef.current){
      (charCorrectRef.current as HTMLDivElement).textContent = "正解文字数: " + "0";
    }
    if(charMissedRef.current){
      (charMissedRef.current as HTMLDivElement).textContent = "不正解文字数: " + "0";
    }
    if(sentenceCorrectRef.current){
      (sentenceCorrectRef.current as HTMLDivElement).textContent = "正解文数: " + "0";
    }

    document.onkeydown = (e) => {
      parser.check(data2, e.key)

      if(charCorrectRef.current){
        (charCorrectRef.current as HTMLDivElement).textContent = "正解文字数: " +  parser.charCorrect.toString();
      }

      if(charMissedRef.current){
        (charMissedRef.current as HTMLDivElement).textContent = "不正解文字数: " + parser.charMissed.toString();
      }

      if(parser.isFinished()){ 
        const randomNum = Math.floor(Math.random() * text1.length); //ランダムな数字を生成
        data2 = parser.build(text2[randomNum]);

        if(sentenceCorrectRef.current) {
          (sentenceCorrectRef.current as HTMLDivElement).textContent = "正解文数: " + parser.sentenceCorrect.toString();
        }

        if(sentenceJPRef.current){
          (sentenceJPRef.current as HTMLDivElement).textContent = text1[randomNum];//漢字の文章をセット
        }

        if(hiraganaRef.current){
          (hiraganaRef.current as HTMLDivElement).textContent = text2[randomNum]; //ひらがなの文章をセット
        }
    }
  } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[loading, isElected]);

  if(!isElected){
    return(
      <>
        <div>テーマを選択してください</div>
        <div>
          <input type="text" onChange={handleThemeChange}/>
          <button onClick={(() => setIsElected(true))}>遊ぶ</button>
        </div>
      </>
    )
  }

  if(loading){
    return <h1>Loading...</h1>
  }

  return(
    <>
      <div className="sentenceJP" id="sentenceJP" ref={sentenceJPRef}></div>
      <div className="hiragana" id="hiragana" ref={hiraganaRef}></div>
      <span className="sentence" id="sentence" ref={sentenceRef}></span>
      <div id="charCorrect" ref={charCorrectRef}></div>
      <div id="sentenceCorrect" ref={charMissedRef}></div>
      <div id="charMissed" ref={sentenceCorrectRef}></div>
    </>
  )
}

export default Japanese;