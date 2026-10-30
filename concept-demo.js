const descriptions= {
  perception:['Perception',
  'Observations → usable context.'],
  memory:['Memory',
  'Task context + observation history.'],
  decision:['Decision-making',
  'Context → next action.'],
  control:['Robot control',
  'Python / ROS → planning + obstacle avoidance.']
}
;
function selectModule(key) {
  document.querySelectorAll('[data-module]').forEach(b=> {
    const active=b.dataset.module===key;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active)
  }
  );
  const d=document.querySelector('#module-detail');
  d.replaceChildren();
  const s=document.createElement('strong');
  s.textContent=descriptions[key][0];
  d.append(s,document.createTextNode(descriptions[key][1]))
}
document.querySelectorAll('[data-module]').forEach(b=>b.addEventListener('click',()=>selectModule(b.dataset.module)));
selectModule('perception');
const tabs=[...document.querySelectorAll('[role=tab]')];
function selectTab(tab) {
  tabs.forEach(t=> {
    const active=t===tab;t.setAttribute('aria-selected',active);t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active
  }
  );
  if(tab.id==='architecture-tab')reset()
}
tabs.forEach((t,i)=> {
  t.addEventListener('click',()=>selectTab(t));t.addEventListener('keydown',e=> {
    let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined) {
      e.preventDefault();tabs[n].focus();selectTab(tabs[n])
    }
  }
  )
}
);
let frame=null;
const robot=document.querySelector('#robot'),
route=document.querySelector('#route'),
run=document.querySelector('#run'),
status=document.querySelector('#route-status');
function reset() {
  cancelAnimationFrame(frame);
  frame=null;
  robot.setAttribute('cx',40);
  robot.setAttribute('cy',220);
  run.disabled=false;
  status.textContent='Ready. An example route avoids two static obstacles.'
}
document.querySelector('#reset').addEventListener('click',reset);
run.addEventListener('click',()=> {
  cancelAnimationFrame(frame);run.disabled=true;status.textContent='Playing conceptual route illustration — no live robot data.';let start;const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:4200;function tick(now) {
    start??=now;const progress=duration===0?1:Math.min((now-start)/duration,1);const point=route.getPointAtLength(route.getTotalLength()*progress);robot.setAttribute('cx',point.x);robot.setAttribute('cy',point.y);if(progress<1)frame=requestAnimationFrame(tick);else {
      run.disabled=false;frame=null;status.textContent='Illustration complete. This is an example path, not a measured planning result.'
    }
  }
  frame=requestAnimationFrame(tick)
}
);
