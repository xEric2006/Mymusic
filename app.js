const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const play = $('.play')
const music = $('.audio')
const progress = $('.progress')


const random = $('.random')
const next = $('.next')
const prev = $('.prev')
const repeat =$('.return')



const listSongs = $('.list-song')
let isPlaying = true;
let isRandom = false;
let isRepeat = false
var currentIndex = 0

const app = {
    
    songs: [
        {
            name: 'Fade',
            author: 'Alan Waker',
            path:'./songs/fade.mp3',
            image:'./image/fade.png'
        },
        {
            name: 'Em Ơi Lên Phố',
            author: 'Minh Vương',
            path:'./songs/EmOiLenPhoMinhVuong.mp3',
            image:'./image/emoilenpho.png'
        },
        {
            name: 'Hạ Còn Vương Nắng',
            author: 'DatKaa',
            path:'./songs/HaConVuongDatKaa.mp3',
            image:'./image/haconvuongnang.png'
        },
        {
            name: 'Hành Lang Cũ',
            author: 'LongNonLa',
            path:'./songs/HanhLangCuLongNonLa.mp3',
            image:'./image/hanhlangcu.png'
        },
        {
            name: 'Hành Lang Cũ',
            author: 'LongNonLa',
            path:'./songs/HanhLangCuLongNonLa.mp3',
            image:'./image/hanhlangcu.png'
        },
    ],
    // ${index === currentIndex ? 'active': ''}
    inner: function(){
        this.songs.forEach((item,index)=>{
            var div = document.createElement('div')
            
            div.setAttribute('class',`song `)
            div.innerHTML =  `<div class="song-thumb"><img src="${item.image}" alt=""></div>
                                    <div class="song-body">
                                        <h3 class="song-name">${item.name}</h3>
                                        <p class="song-author">${item.author}</p>
                                    </div>
                                    <div class="option">
                                        <i class="fa-solid fa-ellipsis-vertical"></i>
                                    </div>`
            listSongs.appendChild(div)
           

        })
        
    },
    hendleEvents: function(){
        // xử lý cd thu nhỏ
        const cdWidth = cd.offsetWidth;
        listSongs.onscroll = function(){
            const scrollTop = listSongs.scrollTop
            const newcdWidth = cdWidth - scrollTop*3
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            cd.style.opacity = newcdWidth/cdWidth
        }
    
       
    },
   
    loadCurrentSong: function(){
        const currentSongOj = this.songs[currentIndex]
        const heading = $('.heading')
        const cdThumb =$('.cd')
        const audio2 = $('.audio')
        
        heading.innerText = `${currentSongOj.name}`
        cdThumb.innerHTML =`<img src="${currentSongOj.image}" alt="">`
        audio2.src = currentSongOj.path
    },
    songPlay:function(){
        var listsong = $$('.song')
        listsong.forEach((item,index)=>{
            if(listsong[0]){
                listsong[0].classList.add('song-active')
            }
            item.addEventListener('click',()=>{
                currentIndex = index;
                const songActive = $('.song-active')
                songActive.classList.remove('song-active')
                item.classList.add('song-active')
                app.loadCurrentSong()
                music.play()
                play.innerHTML =' <div class="pause"><i class="fa-solid fa-pause"></i></div>'
            })
        })
    },
    render: function(){
        
        play.addEventListener('click',function(){
            
            if(isPlaying){ //khi play song
                music.play()
                
                play.innerHTML =' <div class="pause"><i class="fa-solid fa-pause"></i></div>'
                isPlaying = false
                if(isPlaying == false){
                    cdAnimate.play()
                }
                
            }else{ //khi pause song
                music.pause()
                cdAnimate.pause()
                play.innerHTML = '<div class="playing"><i class="fa-solid fa-play"></i></div>'
                isPlaying = true
                if(isPlaying == true){
                    cdAnimate.pause()
                }
            }
        })
        
        // Xử lý khi range
        music.addEventListener('timeupdate',()=>{
            if(music.duration){
                const progressPercent =  Math.floor(music.currentTime / music.duration * 100)               
                progress.value =progressPercent 
            }
            //  xử lý khi kết thúc bài hát
            if(music.currentTime === music.duration){
                currentIndex++
                app.loadCurrentSong()
                music.play()
            }
        })
        // xử lý khi tua
        progress.addEventListener('change',(e)=>{
            music.currentTime = (e.target.value * music.duration / 100)

        })
        // xử lý cd quay 
        
        const cdAnimate = cd.animate([
            {transform: 'rotate(360deg)'}
        ],
            {
                duration: 10000, //10 giay
                iterations : Infinity
            }
        )
        //xử lý random
        random.addEventListener('click',function(){
            isRandom = !isRandom
            this.classList.toggle('active',isRandom)
        })
        //xu ly khi end song
        repeat.addEventListener('click',()=>{
            isRepeat = !isRepeat
            repeat.classList.toggle('active',isRepeat)
        })
        music.addEventListener('ended',()=>{
            if(isRepeat){
                music.play()
            }else{
                next.click()
            }
        })

        
    
    },
    activeSong:function(){
        var listsong = $$('.song')
        const songActive = $('.song-active')
        songActive.classList.remove('song-active')
        listsong[currentIndex].classList.add('song-active')
    },
    nextSong: function(){
        
        next.addEventListener('click',function(e){
            if(isRandom){
                app.playRandom()
            }else{
                currentIndex++             
                // listsong[currentIndex].classList.add('song-active')
                if(currentIndex >= app.songs.length){
                    currentIndex = 0
                }
                app.activeSong()
                app.loadCurrentSong()
                
                music.play()
                play.innerHTML =' <div class="pause"><i class="fa-solid fa-pause"></i></div>'
            }
            
        })

    },
    
    prevSong: function(){
        prev.addEventListener('click',function(e){
            currentIndex--
            console.log(currentIndex)
            if(currentIndex < 0 ){
                currentIndex = app.songs.length-1;
            }
            app.activeSong()
            app.loadCurrentSong()
            music.play()
        })
    },
    playRandom: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random()* app.songs.length)
        }while(newIndex === currentIndex)
        currentIndex = newIndex
        app.loadCurrentSong()
    },
    start: function(){
        this.render() //play và pause song
        this.inner() //thêm song vào list song
        this.hendleEvents()//xử lí sự kiện
        this.loadCurrentSong()
        this.nextSong()
        this.prevSong()
        this.songPlay()
     

    },
    

}

app.start()

