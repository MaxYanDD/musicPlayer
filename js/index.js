var $ = function(e){
    return document.querySelector(e);
  }
  var $$ = function(e){
    return document.querySelectorAll(e);
  }
  var audioObject = $('#music');
  var songPic = $('.songinfo img');
  var title = $('.songtitle h2');
  var author = $('.songtitle p');
  var shadebg = $('.shade');
  var coverbg = $('.cover');
  var play_stop = $('#play_stop');
  var play_stop_pic = $('#play_stop use');
  var nextsong = $('#nextsong');
  var lastsong = $('#lastsong');
  var totaltime = $('#total');
  var current = $('#current');
  var barWidth = $('.progressbar .bar-front');
  var frontbar = $('.bar-back');
  
 
  getSongList(function(list){

    var songindex = 0;
    // 初始化,载入第一首
    loadsong(songindex);

    //播放 暂停
    function play(){
      audioObject.play();
      audioObject.autoplay = true;
      play_stop.innerHTML = '<use xlink:href="#icon-icon12"></use>';
    }
    function pause(){
      audioObject.pause();
      play_stop.innerHTML = '<use xlink:href="#icon-icon"></use>'
    }
    play_stop.onclick = function(){
      if(audioObject.paused){
        play();
      }else{
        pause();
        clearTimeout(timer);
      }
    }

    // 播放时状态跟踪，时间，进度条
    audioObject.ontimeupdate = function(){

      barWidth.style.width = (audioObject.currentTime/audioObject.duration)*300 + 'px';


      timer = setTimeout(function(){
        var sec = Math.floor(audioObject.currentTime)%60 + '';
        sec = sec.length==2? sec : '0'+sec;
        current.innerText = Math.floor(audioObject.currentTime/60) + ':' + sec; 

        var dursec = Math.floor(audioObject.duration)%60 + '';
        dursec = dursec.length==2? dursec : '0'+ dursec;
        totaltime.innerText = Math.floor(audioObject.duration/60) + ':' + dursec;

      },1000)
    }


    // 点击进度条
    frontbar.onclick = function(e){
        console.log(e);
        var percent = e.offsetX/300;
        console.log(percent);
        console.log(audioObject.duration);
        console.log(audioObject.currentTime)
        // chrome存在不能设置currentTime的BUG,
        audioObject.currentTime = audioObject.duration * percent;
  
        console.log(audioObject.duration * percent);
        barWidth.style.width = percent*300 + 'px';
  
      }
      barWidth.onclick = function(e){
        var percent = e.offsetX/300;
        audioObject.currentTime = audioObject.duration * percent;
        barWidth.style.width = e.offsetX + 'px';
      }

    // 上一首、下一首
    function playnext(){
      songindex = songindex >= list.length-1?  0 : ++songindex;
      loadsong(songindex);
    }
    audioObject.onended =function(){
      console.log('完了');
      playnext();
    }
    lastsong.onclick  = function(){
      songindex = songindex <= 0 ? list.length-1 : --songindex;
      loadsong(songindex);
      play_stop.innerHTML = '<use xlink:href="#icon-icon12"></use>';
    }
    nextsong.onclick = function(){
      playnext();
      play_stop.innerHTML = '<use xlink:href="#icon-icon12"></use>';
    }

    // 歌曲src载入
    function loadsong(index){
      songPic.src = list[index].pic;
      shadebg.style.backgroundImage = "url("+ list[index].pic + ")";
      coverbg.style.backgroundImage = "url("+ list[index].pic + ")";
      title.innerText = list[index].title;
      author.innerText = list[index].author;
      audioObject.src = list[index].src; 
      barWidth.style.width = 0;
    }


  });

  function getSongList(callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/songList.json', true);
    xhr.onload = function(e){
      // console.log(e);
      if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
        callback(JSON.parse(xhr.responseText));
      }else{
        console.log('获取数据错误');
      }
    }
    xhr.send();
  };

