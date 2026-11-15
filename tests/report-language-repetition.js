/* Informational audit; prints cross-day text-reuse after removing day/topic wrappers. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const std=load('sections/language/data/language-papers-v2.json');
const adv=load('sections/language/data/language-advanced-v1.json');
function clean(s){
 return String(s).replace(/^In the day \d+ [^:]*? case:\s*/,'')
 .replace(/^For a grade 10[–-]12 [^,]*? assessment,\s*/,'')
 .replace(/^In the [^,]*? (practice|challenge|test) scenario,\s*/,'')
 .toLowerCase().replace(/\s+/g,' ').trim();
}
function audit(label,groups){
 const seen=new Map(),examples=[];
 for(const set of groups)for(const q of set.questions){
  const key=clean(q.text)+'|'+q.options.map(clean).sort().join('~');
  const row=seen.get(key)||[];row.push(q.id);seen.set(key,row);
 }
 const repeats=[...seen.values()].filter(x=>x.length>1);
 console.log(label+': '+[...seen.values()].reduce((n,x)=>n+x.length,0)+' items; '+repeats.length+' repeated cores after stripping wrappers; '+repeats.reduce((n,x)=>n+x.length,0)+' items in repeated clusters');
 for(const group of repeats.slice(0,8))console.log('  '+group.slice(0,7).join(', ')+(group.length>7?' ...':''));
}
audit('Standard Language',[...std.tests,...std.practice]);
audit('Advanced Language',adv.days.flatMap(d=>[{questions:d.practice},{questions:d.challenge},{questions:d.test}]));
console.log('These warnings are editorial findings. Unique question IDs and exact-string matching cannot establish distinct cognitive problems.');
