const READING_BUILD=function buildReadingContent(science,history,narrative,community,foundation,vocabulary,pilot) {
  const genres=[science,history,narrative,community];
  if(genres.some(g=>g.length!==20)||foundation.length!==20||vocabulary.length<650||!pilot.passages||pilot.passages.length!==4)throw Error("Reading sources incomplete");
  const LESSONS=[
    ["Main idea and central claim","Identify the single idea that connects all paragraphs. A main idea is broader than one example."],
    ["Supporting details","Locate a detail directly stated in the passage; do not substitute a plausible guess."],
    ["Vocabulary in context","Use surrounding words to choose the meaning that fits the sentence, not only a dictionary definition."],
    ["Making inferences","Combine evidence with logical reasoning; avoid conclusions that add unsupported facts."],
    ["Author's purpose","Decide whether the writer primarily explains, argues, illustrates, or entertains."],
    ["Tone and attitude","Look for loaded or neutral language to identify an author's overall attitude."],
    ["Evidence and justification","Find the observation or example that most directly supports a claim."],
    ["Organization and structure","Notice chronological, problem-solution, comparison, and cause-effect structures."],
    ["Comparing ideas","Distinguish differences and similarities among approaches or viewpoints."],
    ["Conclusions and qualifications","Look for limits to a conclusion, especially words like may, might, or only."],
    ["Cause and effect","Distinguish a reported correlation from a cause the passage actually establishes."],
    ["Context clues and precision","Examine nearby definitions, contrasts, examples, and qualifications."],
    ["Sequence and chronology","Reconstruct the order of events without assuming every statement is a new step."],
    ["Scientific and historical reasoning","Separate observations, interpretations, and remaining uncertainty."],
    ["Claims versus facts","Recognize the difference between evidence, prediction, interpretation, and opinion."],
    ["Recognizing assumptions","Reject answer choices that require facts the writer never supplies."],
    ["Synthesis across paragraphs","Connect the challenge, method, results, and larger significance."],
    ["Theme and character","Infer values or lessons from decisions and outcomes rather than from isolated details."],
    ["Precise language and nuance","Choose the strongest answer while respecting words of uncertainty and degree."],
    ["Integrated Reading review","Practice main idea, details, inference, purpose, vocabulary, tone, and organization together."]
  ];
  const TERMS=[
    ["methodical","systematic","careless","random","hasty"],
    ["tentative","not yet certain","unchangeable","final","reckless"],
    ["deliberate","intentional","accidental","hurried","unthinking"],
    ["measured","carefully considered","extreme","impulsive","unrestrained"],
    ["prudent","wise and cautious","careless","rash","reckless"],
    ["credible","believable","impossible","unrelated","unreliable"],
    ["adaptable","able to adjust","rigid","fragile","unwilling"],
    ["collaborative","cooperative","secretive","solitary","competitive"],
    ["provisional","subject to revision","permanent","irrefutable","irrelevant"],
    ["limited","restricted in scope","universal","complete","boundless"],
    ["cautious","careful about risk","fearless","indifferent","impulsive"],
    ["insightful","showing understanding","confused","shallow","irrelevant"],
    ["reasonable","supported by good judgment","absurd","random","senseless"],
    ["practical","useful in real situations","purely imaginary","ornamental","impossible"],
    ["gradual","happening in stages","instantaneous","violent","abrupt"],
    ["constructive","helpful in improving something","destructive","hostile","useless"],
    ["precise","exact","vague","careless","broad"],
    ["resilient","able to recover","brittle","hopeless","weak"],
    ["systematic","following a plan","disorganized","haphazard","accidental"],
    ["thorough","complete and careful","superficial","incomplete","hasty"]
  ];
  const alpha="ABCD";
  const size="Which statement is best supported by the passage?";
  function rotate(arr,correct,seed) {
    const shift=seed%4;
    return {choices:arr.map((_,i)=>arr[(i+shift)%4]),correctIndex:(correct-shift+4)%4};
  }
  function item(prefix,num,type,prompt,answer,wrongs,explain,seed) {
    if(wrongs.length!==3)throw Error("Wrong number of distractors "+prefix+"/"+num);
    const opts=[answer,...wrongs];
    if(new Set(opts.map(x=>x.trim().toLowerCase())).size!==4)throw Error("Duplicate options "+prefix+"/"+num+" "+opts.join(" | "));
    const r=rotate(opts,0,seed);
    return {id:prefix+"-"+String(num).padStart(2,"0"),type,prompt,choices:r.choices,correctIndex:r.correctIndex,explanation:explain};
  }
  function makePassage(t,day,section) {
    const term=TERMS[(day*4+section*7)%TERMS.length],vocab=term[0];
    const group=t.genre==="narrative"?"people involved":"participants";
    const paragraph1=t.setting+" "+t.problem+" At first the situation did not offer an obvious answer. A response would require paying attention to both the immediate difficulty and the circumstances surrounding it.";
    const paragraph2=t.method+" "+t.evidence+" These observations mattered because they gave the "+group+" something specific to consider rather than relying only on an initial impression. Their "+vocab+" approach involved examining the available information before making the next decision.";
    const paragraph3=t.limitation+" "+t.outcome+" "+t.insight+" The story therefore points beyond a single successful result: the way a conclusion is reached can be just as important as the conclusion itself.";
    const text=[paragraph1,paragraph2,paragraph3].join("\n\n");
    return {id:"R"+String(day).padStart(2,"0")+"-P"+section,title:t.title,genre:t.genre,text,term};
  }
  function passageQuestions(t,p,day,section) {
    const prefix=p.id,term=p.term;
    const alternatives=genres[(section+1)%4],otherA=alternatives[(day+2)%20],otherB=alternatives[(day+6)%20];
    const methodAlt=["They decided without collecting any additional information.","They relied entirely on an unrelated popular rumor.","They postponed every action without examining the problem."];
    const q=[
      item(prefix,1,"Main Idea","Which statement best expresses the main idea of \""+t.title+"\"?",t.insight,
        [otherA.insight,otherB.insight,"The issue was settled permanently without further evidence."],
        "The final paragraph connects the particular case with the broader lesson: "+t.insight,day+section+1),
      item(prefix,2,"Specific","What challenge led the people in the passage to investigate or act?",t.problem,
        [otherA.problem,otherB.problem,"They had already resolved every uncertainty before beginning."],
        "The passage introduces this exact challenge: "+t.problem,day+section+2),
      item(prefix,3,"Specific","Which approach did the people in the passage actually take?",t.method,
        methodAlt,
        "The method is described in the second paragraph: "+t.method,day+section+3),
      item(prefix,4,"Specific","Which observation or fact appears in the passage?",t.evidence,
        [otherA.evidence,otherB.evidence,"The project produced no observations or results."],
        "The second paragraph supplies the observation: "+t.evidence,day+section+4),
      item(prefix,5,"Inference","Why should the result not be treated as proof of every possible conclusion?",t.limitation,
        ["The passage says all alternative explanations were disproved.","The participants refused to examine any evidence.","Every observation was identical in all times and places."],
        "The author explicitly qualifies the finding: "+t.limitation,day+section+5),
      item(prefix,6,"Specific","What decision or result followed the investigation?",t.outcome,
        [otherA.outcome,otherB.outcome,"The participants abandoned the work without explaining their findings."],
        "The third paragraph states the result: "+t.outcome,day+section+6),
      item(prefix,7,"Inference","Which inference is most reasonable based on the passage \""+t.title+"\"?",
        "The participants used information to respond to a challenge instead of relying solely on first impressions.",
        ["The participants were certain their first idea was correct before beginning.","The passage proves that a single observation always settles complex questions.","The participants considered no evidence before reaching a decision."],
        "They gathered or compared information, then revised or qualified the response rather than making an unsupported claim.",day+section+7),
      item(prefix,8,"Purpose","What is the author's primary purpose in \""+t.title+"\"?",
        "To illustrate how a challenge was approached, what was learned, and what remained uncertain.",
        ["To give directions for reproducing every action exactly.","To advertise a commercial product as the only possible solution.","To tell readers that evidence is unnecessary whenever a decision is urgent."],
        "The passage explains the situation, evidence, a limitation, and a considered response.",day+section+8),
      item(prefix,9,"Organization","Which best describes the organization of \""+t.title+"\"?",
        "It presents a situation and problem, then an approach, evidence, and a qualified outcome.",
        ["It lists unrelated historical dates with no central topic.","It offers only an argument and its direct rebuttal.","It describes several characters without presenting any challenge or response."],
        "The paragraphs move from the initial problem to the method and finding, then the limitation and conclusion.",day+section+9),
      item(prefix,10,"Vocabulary","In the passage \""+t.title+"\", the word \""+term[0]+"\" most nearly means",
        term[1],term.slice(2),
        "The word describes an approach that considers information before acting. In this context, "+term[0]+" means "+term[1]+".",day+section+10)
    ];
    return q.map(x=>({...x,passageId:p.id}));
  }
  function vocabularyQuestions(day,wordPool,count,practice=false) {
    const result=[];
    for(let i=0;i<count;i++) {
      const w=wordPool[i],mode=i%5===1?"antonym":"synonym";
      const key=mode==="antonym"?w.antonym:w.synonym;
      const wrong1=mode==="antonym"?w.synonym:w.antonym;
      const source=vocabulary.filter(z=>z.part===w.part&&z.word!==w.word&&z.synonym&&z.synonym.toLowerCase()!==key.toLowerCase());
      const wrongs=[wrong1];
      for(let k=0;k<source.length*2 && wrongs.length<3;k++){
        const candidate=source[(i*7+k*11+day*3)%source.length];
        const value=candidate.synonym;
        if(value&&value.toLowerCase()!==key.toLowerCase()&&!wrongs.some(x=>x.toLowerCase()===value.toLowerCase()))wrongs.push(value);
      }
      if(wrongs.length<3)throw Error("Insufficient vocab distractors "+w.word);
      const prompt=mode==="antonym"
        ?"Which word is most nearly OPPOSITE in meaning to \""+w.word+"\" in this sentence: \""+w.example+"\"?"
        :"In the sentence \""+w.example+"\", the word \""+w.word+"\" most nearly means";
      const question=item("R"+String(day).padStart(2,"0")+(practice?"-PRV":"-V"),i+1,
        mode==="antonym"?"Antonym":"Reading Vocabulary",prompt,key,wrongs,
        mode==="antonym"?"The opposite of "+w.word+" in context is "+key+". The word means "+w.synonym+"."
          :"In the context of the sentence, "+w.word+" means "+key+".",day*3+i);
      result.push({...question,word:w.word});
    }
    return result;
  }
  function guidedQuestions(f,day,availableWords){
    const main=f.questions;
    const related=foundation.filter(x=>x.day!==f.day);
    const orig=main.map((q,i)=>{
      const wrongs=i===4
        ?["To present a fictional dialogue with no explanation.","To persuade readers to buy a particular product.","To criticize an unnamed person without evidence."]
        :[related[(day+i*3)%related.length].questions[i].answer,
          related[(day+i*3+6)%related.length].questions[i].answer,
          related[(day+i*3+11)%related.length].questions[i].answer];
      return item("RG"+String(day).padStart(2,"0"),i+1,q.skill,q.prompt,q.answer,wrongs,
        "The passage supports the answer: "+q.answer+". Refer to the detail or overall point of the passage.",day*7+i);
    });
    // Further guided practice focuses on evidence evaluation and reading strategy, rather than repeating full-test questions.
    const extensions=[
      item("RG"+String(day).padStart(2,"0"),6,"Evidence",
        "Which strategy is best for checking a detail in \""+f.title+"\"?",
        "Return to the passage and locate the sentence that supports the claim.",
        ["Choose the longest option even when unrelated.","Assume the first answer is always right.","Rely only on what seems generally true outside the passage."],
        "Reading details are evaluated against evidence in the passage, not guesses or general knowledge.",day+6),
      item("RG"+String(day).padStart(2,"0"),7,"Inference",
        "Which statement best describes a defensible inference from \""+f.title+"\"?",
        "It is a conclusion that follows logically from information supplied by the author.",
        ["It is any claim readers personally find exciting.","It must introduce a new event the writer never mentioned.","It cannot be based on more than one sentence."],
        "An inference combines textual clues while remaining within the evidence.",day+7),
      item("RG"+String(day).padStart(2,"0"),8,"Author's purpose",
        "What is the best way to identify the writer's purpose in \""+f.title+"\"?",
        "Consider how the entire passage develops its central point.",
        ["Look only at the very last word.","Choose an answer based on the title alone.","Ignore whether the author presents evidence."],
        "Purpose is determined from the passage as a whole, including its structure and supporting details.",day+8),
      item("RG"+String(day).padStart(2,"0"),9,"Main Idea",
        "Why is a single minor detail a weak main-idea answer for \""+f.title+"\"?",
        "It does not account for the passage as a whole.",
        ["It is always grammatically incorrect.","It must contain an unfamiliar word.","It can never be supported by the passage."],
        "The main idea must encompass the central point rather than only one supporting example.",day+9),
      item("RG"+String(day).padStart(2,"0"),10,"Elimination",
        "Which answer-choice habit most improves accuracy on questions about \""+f.title+"\"?",
        "Reject choices contradicted by the text or requiring unsupported claims.",
        ["Select a choice just because it contains familiar words.","Prefer a claim that is stronger than the author makes.","Treat every plausible real-world statement as stated in the passage."],
        "The best answer is the one supported by the exact text and its reasonable implications.",day+10)
    ];
    return {day,title:f.title,passage:f.passage,lesson:LESSONS[day-1],questions:[...orig,...extensions,...vocabularyQuestions(day,availableWords,5,true)]};
  }
  const excluded=new Set(pilot.vocabularyQuestions.map(x=>String(x.targetWord||"").toLowerCase()));
  const candidates=vocabulary.filter(x=>!excluded.has(x.word.toLowerCase())&&x.word&&x.example&&x.synonym&&x.antonym&&/^[a-z\- ]+$/i.test(x.word));
  const allTests=[];
  for(let d=1;d<=20;d++){
    if(d===1){
      const passages=pilot.passages.map(p=>({id:p.id,title:p.title,text:p.text,genre:"pilot",questions:p.questions.map(q=>({
        id:q.id,type:q.type,prompt:q.prompt,choices:q.choices,correctIndex:q.correctIndex,explanation:q.explanation,passageId:q.passageId
      }))}));
      const vqs=pilot.vocabularyQuestions.map(q=>({id:q.id,type:q.type,prompt:q.prompt,choices:q.choices,correctIndex:q.correctIndex,explanation:q.explanation,word:q.targetWord}));
      allTests.push({day:d,durationMinutes:23,passages,vocabularyQuestions:vqs,totalQuestions:62});
      continue;
    }
    const chosen=genres.map((g,index)=>g[d-2]);
    const passages=chosen.map((entry,index)=>{
      const passage=makePassage(entry,d,index+1);
      return {...passage,questions:passageQuestions(entry,passage,d,index+1)};
    });
    const vocabStart=(d-2)*22;
    const vqs=vocabularyQuestions(d,candidates.slice(vocabStart,vocabStart+22),22);
    allTests.push({day:d,durationMinutes:23,passages,vocabularyQuestions:vqs,totalQuestions:62});
  }
  const guides=foundation.map((f,i)=>{
    const start=19*22+i*5;
    return guidedQuestions(f,i+1,candidates.slice(start,start+5));
  });
  return {version:2,blueprint:{days:20,questions:62,minutes:23,passagesPerDay:4,comprehensionPerPassage:10,comprehensionQuestions:40,vocabularyQuestions:22},tests:allTests,practice:guides,lessons:LESSONS};
};
