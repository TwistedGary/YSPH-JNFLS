(() => {
 const cards=[...document.querySelectorAll('[data-member-card]')];
 if(!cards.length || typeof HTMLDialogElement==='undefined' || !HTMLDialogElement.prototype.showModal) return;
 const make=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node;};
 const language=()=>document.body.dataset.language==='zh'?'zh':'en';
 const copy=node=>node?.dataset[language()]||node?.textContent?.trim()||'';
 const dialog=make('dialog','member-dialog');
 dialog.setAttribute('aria-labelledby','member-profile-name');
 dialog.setAttribute('aria-describedby','member-profile-bio');
 const close=make('button','member-dialog-close','×');close.type='button';close.autofocus=true;
 const layout=make('div','member-dialog-layout');
 const portrait=make('div','member-dialog-portrait');
 const content=make('div','member-dialog-content');
 const eyebrow=make('p','member-dialog-eyebrow');
 const name=make('h2');name.id='member-profile-name';
 const role=make('p','member-dialog-role');
 const rule=make('div','member-dialog-rule');rule.setAttribute('aria-hidden','true');
 const bio=make('p','member-dialog-bio');bio.id='member-profile-bio';
 const note=make('p','member-dialog-note');
 const signature=make('p','member-dialog-signature','YSPH-JNFLS');
 content.append(eyebrow,name,role,rule,bio,note,signature);layout.append(portrait,content);dialog.append(close,layout);document.body.append(dialog);
 let activeCard=null,opener=null,pointerStartedOutside=false;
 function render(){
  const zh=language()==='zh';
  close.setAttribute('aria-label',zh?'关闭成员介绍':'Close member profile');
  cards.forEach(card=>{card.querySelector('.member-open-label').textContent=zh?'查看介绍':'View profile';});
 if(!activeCard)return;
  const title=activeCard.querySelector('h3');
  const details=title.parentElement;
  const placeholder=Boolean(activeCard.querySelector('.placeholder-photo'));
  eyebrow.textContent=placeholder?(zh?'团队职责':'TEAM ROLE'):(zh?'认识我们的成员':'MEET OUR PEOPLE');
  name.textContent=placeholder?(zh?'成员待补充':'Member to be announced'):copy(title);
  role.textContent=copy(details.querySelector('span'));
  bio.textContent=copy(details.querySelector('.member-profile-copy'))||copy(details.querySelector('p'));
  note.hidden=!placeholder;
  note.textContent=zh?'此处展示该岗位职责，成员姓名和照片待补充。':'This profile describes the role. The member’s name and photograph will be added when available.';
  portrait.replaceChildren();
  const photo=activeCard.querySelector('.member-photo img');
  if(photo){const img=make('img');img.src=photo.getAttribute('src');img.alt=photo.alt;img.className=photo.className;portrait.append(img);portrait.classList.remove('is-placeholder');}
  else {const initial=make('span','member-profile-initial',activeCard.querySelector('.member-photo').textContent.trim());initial.setAttribute('aria-hidden','true');portrait.append(initial);portrait.classList.add('is-placeholder');}
 }
 cards.forEach((card,index)=>{
  const title=card.querySelector('h3');if(!title)return;
  title.id=title.id||`member-name-${index+1}`;
  const button=make('button','member-open');button.type='button';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','member-profile');
  const label=make('span','member-open-label');label.id=`member-open-label-${index+1}`;
  const arrow=make('span','member-open-arrow','↗');arrow.setAttribute('aria-hidden','true');
  button.append(label,arrow);button.setAttribute('aria-labelledby',`${label.id} ${title.id}`);
  button.addEventListener('click',()=>{activeCard=card;opener=button;render();dialog.showModal();document.body.classList.add('member-profile-open');});
  card.append(button);card.classList.add('is-interactive');
 });
 dialog.id='member-profile';
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',event=>{if(event.key==='Escape')event.stopPropagation();});
 const outside=event=>{const r=dialog.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;};
 dialog.addEventListener('pointerdown',event=>{pointerStartedOutside=event.target===dialog&&outside(event);});
 dialog.addEventListener('pointerup',event=>{if(pointerStartedOutside&&event.target===dialog&&outside(event))dialog.close();pointerStartedOutside=false;});
 dialog.addEventListener('close',()=>{document.body.classList.remove('member-profile-open');opener?.focus({preventScroll:true});activeCard=null;});
 document.addEventListener('ysph-language',render);
 render();
})();
