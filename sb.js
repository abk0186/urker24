// Мини-клиент Supabase (REST + Auth) без зависимостей.
(function(){
'use strict';
function create(opts){
 opts=opts||{};
 const C=window.URKER_CONFIG||{};
 const url=String(C.supabaseUrl||'').replace(/\/+$/,''), key=String(C.supabaseAnonKey||'');
 const enabled=!!(url&&key);
 const SK='urker_admin_session_v1';
 let session=null;
 if(opts.auth){try{session=JSON.parse(localStorage.getItem(SK))}catch(e){session=null}}
 const save=s=>{session=s;if(s)localStorage.setItem(SK,JSON.stringify(s));else localStorage.removeItem(SK)};
 async function raw(method,path,body,extra,timeout){
  const ctl=new AbortController();const tm=setTimeout(()=>ctl.abort(),timeout||8000);
  // Новые ключи Supabase (sb_publishable_…) — не JWT: передаём только в заголовке apikey.
  // Authorization: Bearer — только токен вошедшего администратора.
  const h=Object.assign({apikey:key,'Content-Type':'application/json'},(opts.auth&&session&&session.access_token)?{Authorization:'Bearer '+session.access_token}:{},extra||{});
  try{
   const r=await fetch(url+path,{method,headers:h,body:body!=null?JSON.stringify(body):undefined,signal:ctl.signal,cache:'no-store'});
   const txt=await r.text();let data=null;try{data=txt?JSON.parse(txt):null}catch(e){data=txt}
   if(!r.ok){const m=(data&&(data.message||data.error_description||data.msg||data.error))||r.statusText;const err=new Error(m);err.status=r.status;err.code=String(m||'');throw err}
   return data;
  }finally{clearTimeout(tm)}
 }
 async function fresh(){
  if(!opts.auth||!session)return;
  if(session.expires_at&&session.expires_at-60>Date.now()/1000)return;
  try{const s=await raw('POST','/auth/v1/token?grant_type=refresh_token',{refresh_token:session.refresh_token});save(norm(s))}
  catch(e){save(null)}
 }
 const norm=s=>Object.assign({},s,{expires_at:s.expires_at||Math.floor(Date.now()/1000)+(+s.expires_in||3600)});
 async function req(method,path,body,extra,timeout){if(!enabled)throw new Error('backend_disabled');await fresh();return raw(method,'/rest/v1/'+path,body,extra,timeout)}
 const api={
  enabled,url,
  get:(pq,timeout)=>req('GET',pq,null,null,timeout),
  insert:(table,row)=>req('POST',table,row,{Prefer:'return=representation'}),
  update:(table,filter,patch)=>req('PATCH',table+'?'+filter,patch,{Prefer:'return=representation'}),
  remove:(table,filter)=>req('DELETE',table+'?'+filter,null,{Prefer:'return=minimal'}),
  rpc:(fn,args,timeout)=>req('POST','rpc/'+fn,args||{},null,timeout),
  // «выстрелил и забыл» (статистика): не ждёт ответа, переживает переход по ссылке
  beacon(fn,args){if(!enabled)return;try{fetch(url+'/rest/v1/rpc/'+fn,{method:'POST',keepalive:true,headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify(args||{})}).catch(()=>{})}catch(e){}},
  // Storage (фото новостей): загрузка/удаление — только с токеном администратора (политики storage.objects)
  async upload(bucket,path,blob,contentType){if(!enabled)throw new Error('backend_disabled');await fresh();
   const ctl=new AbortController();const tm=setTimeout(()=>ctl.abort(),60000);
   try{const r=await fetch(url+'/storage/v1/object/'+bucket+'/'+path,{method:'POST',signal:ctl.signal,body:blob,
     headers:Object.assign({apikey:key,'Content-Type':contentType||blob.type||'application/octet-stream','cache-control':'31536000','x-upsert':'false'},session&&session.access_token?{Authorization:'Bearer '+session.access_token}:{})});
    const txt=await r.text();let d=null;try{d=JSON.parse(txt)}catch(e){d=txt}
    if(!r.ok){const err=new Error((d&&(d.message||d.error))||r.statusText);err.status=r.status;throw err}
    return{path,url:api.publicUrl(bucket,path)}}finally{clearTimeout(tm)}},
  async removeFile(bucket,path){if(!enabled)throw new Error('backend_disabled');await fresh();
   const r=await fetch(url+'/storage/v1/object/'+bucket+'/'+path,{method:'DELETE',headers:Object.assign({apikey:key},session&&session.access_token?{Authorization:'Bearer '+session.access_token}:{})});
   if(!r.ok&&r.status!==404){const err=new Error('storage '+r.status);err.status=r.status;throw err}},
  publicUrl:(bucket,path)=>url+'/storage/v1/object/public/'+bucket+'/'+path.split('/').map(encodeURIComponent).join('/'),
  session:()=>session,
  async signInWithPassword(email,password){const s=await raw('POST','/auth/v1/token?grant_type=password',{email,password});save(norm(s));return session},
  async signInWithOtp(email,redirectTo){return raw('POST','/auth/v1/otp?redirect_to='+encodeURIComponent(redirectTo),{email,create_user:false})},
  handleRedirect(){ // ссылка из письма: #access_token=...&refresh_token=...
   const h=new URLSearchParams(location.hash.replace(/^#/,''));
   if(h.get('access_token')){save(norm({access_token:h.get('access_token'),refresh_token:h.get('refresh_token'),expires_in:h.get('expires_in')}));history.replaceState(null,'',location.pathname+location.search);return true}
   return false},
  async signOut(){try{await raw('POST','/auth/v1/logout',null)}catch(e){}save(null)},
  email(){try{return JSON.parse(atob(session.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).email}catch(e){return ''}}
 };
 return api;
}
window.SBCreate=create;
})();
