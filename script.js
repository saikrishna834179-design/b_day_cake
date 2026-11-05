(function(){
  var stage=document.getElementById('stage'),btn=document.getElementById('btn'),msg=document.getElementById('msg');
  var lit=true,busy=false;
  var TUNE=[[392,.75],[392,.25],[440,1],[392,1],[523,1],[494,2],
    [392,.75],[392,.25],[440,1],[392,1],[587,1],[523,2],
    [392,.75],[392,.25],[784,1],[659,1],[523,1],[494,1],[440,2],
    [698,.75],[698,.25],[659,1],[523,1],[587,1],[523,2]];
  var ctx=null,master=null;
  var LINES=[['Hap-','py ','birth-','day ','to ','you'],['Hap-','py ','birth-','day ','to ','you'],['Hap-','py ','birth-','day ','dear ','fri-','end'],['Hap-','py ','birth-','day ','to ','you']];
  var lyr=document.getElementById('lyrics'),timers=[];
  function clearLyrics(){timers.forEach(clearTimeout);timers=[];lyr.textContent='';}
  function lyricAt(k,ms){
    var line=0,idx=k;
    while(idx>=LINES[line].length){idx-=LINES[line].length;line++;}
    timers.push(setTimeout(function(){
      if(idx===0){
        lyr.innerHTML='';
        LINES[line].forEach(function(s){var e=document.createElement('span');e.className='syl';e.textContent=s;lyr.appendChild(e);});
      }
      var sy=lyr.children;
      for(var i=0;i<sy.length;i++)sy[i].classList.toggle('on',i<=idx);
    },Math.max(0,ms)));
  }
  function stopMusic(){
    clearLyrics();
    if(master){try{master.gain.cancelScheduledValues(0);master.gain.setValueAtTime(0,ctx.currentTime);master.disconnect();}catch(e){}master=null;}
  }
  function playMusic(){
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return;
    try{
      if(!ctx)ctx=new AC();
      if(ctx.state==='suspended')ctx.resume();
      stopMusic();
      master=ctx.createGain();master.gain.value=.25;master.connect(ctx.destination);
      var t=ctx.currentTime+.15,beat=.4;
      TUNE.forEach(function(n,k){
        var o=ctx.createOscillator(),g=ctx.createGain(),d=n[1]*beat;
        o.type='triangle';o.frequency.value=n[0];
        g.gain.setValueAtTime(0,t);
        g.gain.linearRampToValueAtTime(1,t+.02);
        g.gain.exponentialRampToValueAtTime(.001,t+d*.95);
        o.connect(g);g.connect(master);
        o.start(t);o.stop(t+d);lyricAt(k,(t-ctx.currentTime)*1000);
        t+=d;
      });
    }catch(e){}
  }
  function balloons(){
    var cols=['#ff9fb8','#ffd166','#7fd1c7','#b69cff','#e0457b'];
    for(var i=0;i<8;i++){
      var b=document.createElement('div');b.className='ball';
      b.style.left=(5+i*12)+'vw';
      b.style.background=cols[i%cols.length];
      b.style.setProperty('--dx',(Math.random()*60-30)+'px');
      b.style.animationDuration=(4+Math.random()*3)+'s';
      b.style.animationDelay=(Math.random()*.8)+'s';
      document.body.appendChild(b);
      setTimeout(function(el){el.remove()},8500,b);
    }
  }
  function showBanner(){
    var bn=document.getElementById('banner');
    bn.innerHTML='';bn.classList.remove('show');
    var n=0;
    ['Happy','Birthday!'].forEach(function(word){
      var w=document.createElement('span');w.className='w';
      word.split('').forEach(function(ch){
        var l=document.createElement('span');l.className='l';l.textContent=ch;
        l.style.animationDelay=(n++*0.07)+'s';w.appendChild(l);
      });
      bn.appendChild(w);
    });
    void bn.offsetWidth;bn.classList.add('show');
  }
  function popMsg(){msg.classList.remove('pop');void msg.offsetWidth;msg.classList.add('pop');}
  function confetti(){balloons();showBanner();playMusic();
    var colors=['#ff9fb8','#ffd166','#7fd1c7','#e0457b','#fff4e6'];
    for(var i=0;i<80;i++){
      var c=document.createElement('div');c.className='conf';
      c.style.left=Math.random()*100+'vw';
      c.style.background=colors[i%colors.length];
      c.style.animationDuration=(2+Math.random()*2)+'s';
      c.style.animationDelay=(Math.random()*.5)+'s';
      document.body.appendChild(c);
      setTimeout(function(el){el.remove()},5000,c);
    }
  }
  btn.addEventListener('click',function(){
    if(busy)return;busy=true;
    if(lit){
      stage.classList.add('blowing');
      setTimeout(function(){
        stage.classList.remove('blowing');
        stage.classList.add('out');
        document.body.classList.add('dark-room');
        msg.textContent='Happy birthday! 🎂';popMsg();
        btn.textContent='Light it again';
        lit=false;busy=false;
        confetti();
      },450);
    }else{
      stage.classList.remove('out');
      document.body.classList.remove('dark-room');
      msg.textContent='Make a wish!';popMsg();stopMusic();
      btn.textContent='Blow out the candle';
      lit=true;busy=false;
    }
  });
})();
