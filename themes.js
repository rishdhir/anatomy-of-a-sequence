// Panda palette applied to the whole presentation surface, including controls.
(()=>{
 const themes=['graphite','midnight','graphite','midnight','plum','plum','plum','midnight','teal','midnight','teal','warm','teal','midnight','graphite'];
 function sync(){const slide=document.querySelector('.slide:not([hidden])');if(!slide)return;const n=Number(slide.id.replace('slide-',''))-1;document.body.dataset.theme=themes[n]||'graphite';}
 new MutationObserver(sync).observe(document.getElementById('stage'),{subtree:true,attributes:true,attributeFilter:['hidden']});sync();
})();
