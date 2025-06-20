import { createContext, useRef, useState, useEffect } from "react";
import { songsData} from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second:0,
            minute:0
        },
        totalTime: {
            second:0,
            minute:0
        }
    })

    const play = async () => {
        await audioRef.current.play() //修改成等待promise结果
        setPlayStatus(true)
    }

    const pause = async () => {
        await audioRef.current.pause(); //修改成等待promise结果
        setPlayStatus(false);
    }

    const playWithId = async (id) => {
        await setTrack(songsData[id]);
        await audioRef.current.play();
        setPlayStatus(true);
    }

    const previous = async () => {
        if (track.id>0) {
            await setTrack(songsData[track.id-1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }

    const next = async () => {
        if (track.id < songsData.length-1) {
            await setTrack(songsData[track.id+1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }

    const seekSong = async(e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
    }

    useEffect(()=>{ 
        setTimeout(()=> {
        audioRef.current.ontimeupdate = () => {
            seekBar.current.style.width = (Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%"
            setTime({
                currentTime: {
                    second:Math.floor(audioRef.current.currentTime % 60),
                    minute:Math.floor(audioRef.current.currentTime / 60)
                },
                totalTime: {
                    second: Math.floor(audioRef.current.duration % 60),
                    minute: Math.floor(audioRef.current.duration / 60)
                }

            })

        }
    },1000);
    },[audioRef])  //这里audioRef/audioRef.current写了和[]一样 

/*用户打开页面
  ↓
useEffect 触发
  ↓
setTimeout 等待 1 秒
  ↓
绑定 audioRef.current.ontimeupdate 事件
  ↓
用户点击“播放”
  ↓
音频开始播放，每 250ms 触发 ontimeupdate
  ↓
调用 setTime → 更新当前时间/总时间
  ↓
React 页面重新渲染 */

/*
为什么一定要放在 useEffect 里？
React 的运行顺序是这样的：
组件执行 JSX（创建虚拟 DOM）

audioRef 初始化为 { current: null }

JSX 里的 <audio ref={audioRef} /> 被挂载

挂载后 React 才会把真实 DOM 放到 audioRef.current 上

这时候才可以访问 audioRef.current.ontimeupdate
*/


    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track, setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play, pause,
        playWithId,
        previous,next,
        seekSong
    }
    


    return (
        <PlayerContext.Provider value = {contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider;
