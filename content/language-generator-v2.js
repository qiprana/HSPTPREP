const LANGUAGE_BUILD=function buildLanguageContent(seed,errors,sessions) {
  if(seed.scenes.length!==20||seed.topics.length<25||errors.length<70||sessions.length!==20)throw Error("Content source inputs incomplete");
  const SECTION={total:60,minutes:25,groups:[{id:"usage",title:"Usage and Mechanics",count:30},{id:"spelling",title:"Spelling",count:10},{id:"composition",title:"Composition",count:20}]};
  const BANDS=[[0,13,6],[14,26,5],[27,42,5],[43,53,4],[54,70,6],[71,errors.length-1,4]];
  const badSpelling={
    accommodate:"accomodate",accompany:"acommpany",achieve:"acheive",address:"adress",apparent:"aparent",argument:"arguement",athlete:"athelete",attendance:"attendence",available:"availible",awkward:"awkard",
    beginning:"begining",believe:"beleive",beneficial:"beneficail",bicycle:"bicycel",boundary:"boundry",business:"buisness",calendar:"calender",candidate:"candadate",category:"catagory",ceremony:"ceramony",
    certain:"certian",challenge:"challange",character:"charactor",committee:"comittee",communicate:"comunicate",competition:"competion",conscience:"concience",conscious:"concious",consequence:"consequense",consistent:"consistant",
    convenient:"convinient",courageous:"corageous",criticize:"critisize",curiosity:"curiousity",definite:"definate",desperate:"desparate",develop:"develope",dictionary:"dictionery",difference:"differance",difficult:"dificult",
    disappear:"dissapear",disappoint:"dissapoint",discipline:"dicipline",discuss:"discus",efficient:"effecient",eighth:"eigth",eligible:"eligable",embarrass:"embarass",emergency:"emergancy",environment:"enviroment",
    especially:"especialy",essential:"essensial",exaggerate:"exagerate",excellent:"excelent",exercise:"excercise",existence:"existance",experience:"experiance",experiment:"experement",explanation:"explaination",extraordinary:"extraordenary",
    familiar:"familar",fascinate:"fasinate",favorite:"favourit",February:"Febuary",finally:"finaly",financial:"finantial",foreign:"foriegn",forty:"fourty",frequently:"frequentley",friend:"freind",
    government:"goverment",grammar:"grammer",guarantee:"garantee",guidance:"guidence",handkerchief:"hankerchief",harass:"harrass",height:"heigth",hesitate:"hesatate",hierarchy:"heirarchy",humorous:"humourous",
    immediately:"immediatly",independent:"independant",indispensable:"indispensible",inevitable:"inevitible",influence:"influance",ingredient:"ingrediant",innocent:"inocent",intelligence:"inteligence",interrupt:"interupt",invitation:"invetation",
    jealous:"jelous",judgment:"judgmant",knowledge:"knowlege",language:"langauge",leisure:"liesure",library:"libary",license:"lisence",lightning:"lightnning",maintenance:"maintanance",manageable:"managable",
    marriage:"marrige",mathematics:"mathamatics",medicine:"medecine",miniature:"miniture",mischievous:"mischevious",necessary:"neccessary",neighbor:"neigbor",neither:"niether",nervous:"nervouse",noticeable:"noticable",
    occasion:"ocassion",occasionally:"ocassionally",occur:"occurr",occurrence:"occurence",opinion:"opionion",opportunity:"oppertunity",original:"orignal",parallel:"paralel",parliament:"parliment",particular:"particullar",
    pastime:"passtime",patience:"patiance",peculiar:"peculier",permanent:"permenant",perseverance:"perserverance",persuade:"persaude",physical:"phisical",pleasant:"plesant",possess:"posess",possible:"possable",
    precede:"preceed",preferred:"prefered",prejudice:"predjudice",preparation:"preperation",privilege:"privelege",probably:"probly",procedure:"proceedure",profession:"proffession",pronunciation:"pronounciation",psychology:"psycology",
    questionnaire:"questionaire",receive:"recieve",recognize:"recognnize",recommend:"recomend",reference:"referance",referred:"refered",relevant:"relavent",remember:"remeber",repetition:"repetiton",responsible:"responsable",
    restaurant:"restaraunt",rhythm:"rythm",rigorous:"rigourous",sacrifice:"sacrafice",schedule:"schedual",secretary:"secretery",separate:"seperate",serious:"serius",similar:"similiar",sincerely:"sincerly",
    sophomore:"sophmore",souvenir:"sovenir",specific:"specfic",speech:"speach",stomach:"stomache",strategy:"stragety",successful:"succesful",sufficient:"sufficent",surprise:"suprise",symbol:"symbal",
    temperature:"temprature",temporary:"tempory",thorough:"thourough",though:"thogh",through:"thruogh",throughout:"througout",tomorrow:"tommorrow",tradition:"tradtion",truly:"truely",twelfth:"twelth",
    unanimous:"unamimous",unnecessary:"unecessary",until:"untill",usually:"usualy",vacuum:"vaccum",valuable:"valuble",vegetable:"vegtable",vehicle:"vehical",villain:"villian",visible:"visable",
    Wednesday:"Wensday",weird:"wierd",whether:"wether",which:"wich",wholly:"wholely",wisdom:"wisdome",withdrawal:"withdrawl",written:"writen",yield:"yeild",zealous:"zealos"
  };
  const alpha="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function ctx(day,i,k=0) {
    const scene=seed.scenes[(day*7+i*3+k*11)%seed.scenes.length];
    const other=seed.scenes[(day*13+i*7+k*3+7)%seed.scenes.length];
    return {
      N:scene.name,N2:other.name,thing:scene.singular,things:scene.plural,people:scene.people,
      peoplePoss:/s$/i.test(scene.people)?scene.people+"'":scene.people+"'s",
      group:scene.group,event:scene.event,month:scene.month,monthLower:scene.month.toLowerCase(),lake:scene.lake
    };
  }
  function fill(s,day,i,k) {
    const vars=ctx(day,i,k);
    return s.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g,(match,name)=>{
      if(!(name in vars))throw Error("Unknown template placeholder "+match);
      return vars[name];
    });
  }
  function distinctOptions(question) {
    if(!Array.isArray(question.options)||question.options.length!==4||new Set(question.options.map(x=>x.trim().toLowerCase())).size!==4)
      throw Error("Duplicate or malformed answer options in "+question.id+": "+JSON.stringify(question.options));
    if(!(question.correctIndex>=0&&question.correctIndex<4))throw Error("Wrong correctIndex in "+question.id);
    if(!question.explanation||question.explanation.length<20)throw Error("Missing explanation in "+question.id);
    return question;
  }
  function usageItem(day,q,practice=false,forcedIndex=null) {
    let running=0,selected=errors[0],ti=0;
    for(let b=0;b<BANDS.length;b++) {
      const [start,end,quota]=BANDS[b];
      if(q<running+quota){ti=start+(day*5+(q-running)*3+(practice?9:0))%(end-start+1);selected=errors[ti];break;}
      running+=quota;
    }
    if(Number.isInteger(forcedIndex)){ti=forcedIndex;selected=errors[ti];}
    const noMistakes=(q+day+(practice?1:0))%6===0,correctIndex=noMistakes?3:(q+day+(practice?2:0))%3;
    const mainBad=fill(selected[1],day,q,0),mainGood=fill(selected[2],day,q,0);
    const differentIndexA=(ti+17+(q%4))%errors.length;
    const differentIndexB=(ti+39+(q%7))%errors.length;
    const goodA=fill(errors[differentIndexA][2],day,q,1);
    const goodB=fill(errors[differentIndexB][2],day,q,2);
    const options=noMistakes?[mainGood,goodA,goodB,"No mistakes."]:[goodA,goodB,mainBad,"No mistakes."];
    if(!noMistakes){options.splice(2,1);options.splice(correctIndex,0,mainBad);}
    const letter=noMistakes?"D":alpha[correctIndex];
    return distinctOptions({
      id:"L"+String(day).padStart(2,"0")+"-"+(practice?"P":"U")+String(q+1).padStart(2,"0"),
      group:"usage",skill:noMistakes?"Mixed usage and mechanics":selected[0],
      text:"Which sentence contains an error?",
      options,correctIndex,
      explanation:noMistakes
        ?"None of the three sentences contains a grammar, usage, or punctuation error. Choice D is correct."
        :"Sentence "+letter+" contains the error. "+selected[3]+" Corrected sentence: "+mainGood
    });
  }
  function fakeSpelling(word) {
    if(badSpelling[word])return badSpelling[word];
    const doubles=word.match(/([a-z])\1/i);
    if(doubles)return word.slice(0,doubles.index)+word.slice(doubles.index+1);
    if(word.length<5)return word.slice(0,2)+word[1]+word.slice(2);
    const p=Math.max(2,Math.floor(word.length/2)-1);
    return word.slice(0,p)+word[p+1]+word[p]+word.slice(p+2);
  }
  function spellingItem(day,q,practice=false) {
    const words=sessions[day-1].words,target=words[(q*3+day+(practice?5:0))%words.length],noMistakes=(q+day+(practice?2:0))%5===0;
    const other1=words[(q*3+day+4+(practice?1:0))%words.length],other2=words[(q*3+day+9+(practice?2:0))%words.length],misspelling=fakeSpelling(target);
    if(!misspelling||misspelling.toLowerCase()===target.toLowerCase())throw Error("Invalid misspelling "+target);
    const correctIndex=noMistakes?3:(q+day+(practice?1:0))%3;
    const options=noMistakes?[target,other1,other2,"No mistakes."]:[other1,other2,misspelling,"No mistakes."];
    if(!noMistakes){options.splice(2,1);options.splice(correctIndex,0,misspelling);}
    return distinctOptions({
      id:"L"+String(day).padStart(2,"0")+"-"+(practice?"PS":"S")+String(q+1).padStart(2,"0"),
      group:"spelling",skill:"Spelling",
      text:"Which word is misspelled?",
      options,correctIndex,
      explanation:noMistakes?"All three words are spelled correctly. Recall the standard forms: "+[target,other1,other2].join(", ")+"."
       :"The misspelled form is "+misspelling+". Correct spelling: "+target+". Review its letter sequence and practise spelling it without looking."
    });
  }
  function rotate(q,seed) {
    const shift=((seed%4)+4)%4;
    const opts=q.options.map((_,i)=>q.options[(i+shift)%4]);
    return {...q,options:opts,correctIndex:(q.correctIndex-shift+4)%4};
  }
  function lowerFirst(s){return s[0].toLowerCase()+s.slice(1)}
  function compositionItem(day,j,practice=false) {
    const type=(day+j+(practice?3:0))%24;
    const a=seed.topics[(day+type*3+(practice?7:0))%seed.topics.length];
    const b=seed.topics[(day+type*3+9)%seed.topics.length];
    const claim=a.claim, detail=a.detail, unrelated=a.unrelated, problem=a.problem,solution=a.solution,outcome=a.outcome,steps=a.steps;
    const vague="There are many interesting things to learn about "+a.topic+".";
    let text="",options=[],correct=0,explain="",skill="";
    switch(type){
      case 0:
        skill="Topic sentences";text="Which is the strongest topic sentence for a paragraph about "+a.topic+"?";
        options=[claim,detail,vague,unrelated];explain="A focused topic sentence states the controlling idea rather than one detail or an unrelated fact.";break;
      case 1:
        skill="Supporting details";text="Which sentence is the strongest specific evidence supporting this claim? "+claim;
        options=[detail,unrelated,vague,"The organizers were excited at first."];explain="Specific observations provide stronger support than vague statements or unrelated information.";break;
      case 2:
        skill="Paragraph unity";text="Consider a paragraph about "+a.topic+": (1) "+claim+" (2) "+detail+" (3) "+unrelated+" (4) "+outcome+" Which numbered sentence should be removed?";
        options=["Sentence 3","Sentence 1","Sentence 2","Sentence 4"];explain="Sentence 3 shifts to an unrelated subject and breaks paragraph unity.";break;
      case 3:
        skill="Titles";text="A paragraph explains the topic of "+a.topic+" using this evidence: "+detail+" Which title best fits?";
        options=[a.title,"A Complete History of Everything","The Story of "+b.topic,"An Unrelated Adventure"];explain="The strongest title accurately describes the central topic at an appropriate level of specificity.";break;
      case 4:
        skill="Organization";text="In explaining a process for "+a.topic+", which action should come FIRST?";
        options=[steps[0],steps[1],steps[2],outcome];explain="The first step establishes what is needed before later actions and results.";break;
      case 5:
        skill="Logical sequence";text="Put these actions in their most logical order: (1) "+steps[1]+" (2) "+steps[2]+" (3) "+steps[0];
        options=["3, 1, 2","1, 2, 3","2, 1, 3","3, 2, 1"];explain="The original process is first step, second step, then third step: 3, 1, 2 in the scrambled list.";break;
      case 6:
        skill="Sentence placement";text="After this first step in a paragraph about "+a.topic+" — '"+steps[0]+"' — which sentence best follows?";
        options=[steps[1],steps[2],outcome,unrelated];explain="The second process step logically follows the first.";break;
      case 7:
        skill="Conclusions";text="A paragraph explains "+a.topic+" and notes: '"+detail+"' Which ending best restates its larger point?";
        options=[claim,unrelated,problem,"This paragraph has reached its last sentence."];explain="A conclusion returns to the central idea instead of adding an irrelevant or isolated detail.";break;
      case 8:
        skill="Contrasting transitions";text="Choose a transition: '"+problem+" ____ "+outcome+"'";
        options=["However,","Therefore,","For example,","Likewise,"];explain="However signals a contrast between an initial obstacle and a positive result.";break;
      case 9:
        skill="Cause-and-effect transitions";text="Choose a transition: '"+problem+" ____ "+solution+"'";
        options=["Therefore,","In contrast,","For instance,","Meanwhile,"];explain="Therefore introduces a response or result prompted by the earlier problem.";break;
      case 10:
        skill="Examples";text="The topic sentence is: '"+claim+"' Which sentence gives the clearest concrete example?";
        options=[detail,unrelated,vague,"Someone said the idea sounded interesting."];explain="The specific observation illustrates the topic sentence.";break;
      case 11:
        skill="Conciseness";text="Choose the clearest revision of: 'The group made advance preparations ahead of time for the "+a.topic+" project.'";
        options=["The group prepared for the "+a.topic+" project.","The group made preparations in advance ahead of time.","In advance, preparations were prepared by the group.","The group was at the point of planning preparations."];explain="The concise revision eliminates repeated expressions without losing meaning.";break;
      case 12:
        skill="Identifying problems";text="In a paragraph about "+a.topic+", which sentence introduces a problem that needs a response?";
        options=[problem,outcome,unrelated,detail];explain="The statement names the obstacle to be addressed.";break;
      case 13:
        skill="Solutions";text="Which sentence best explains how the participants responded to this problem: '"+problem+"'?";
        options=[solution,unrelated,"The project had started before this problem.","People sometimes enjoy community projects."];explain="A relevant solution directly addresses the stated problem.";break;
      case 14:
        skill="Paragraph development";text="A paragraph says: '"+problem+"' and ends with '"+outcome+"' Which sentence best connects the two?";
        options=[solution,unrelated,steps[0],vague];explain="The missing sentence should explain the intervention between the challenge and result.";break;
      case 15:
        skill="Main idea";text="Read: '"+claim+" "+detail+"' Which summary captures the main idea without focusing on one minor fact?";
        options=[claim,detail,unrelated,"No clear conclusion about the topic is possible."];explain="A suitable summary expresses the whole idea rather than only one detail.";break;
      case 16:
        skill="Supporting facts";text="Which fact would best support a paragraph arguing that "+a.topic+" produced observable results?";
        options=[detail,vague,unrelated,"The organizers thought their work was important."];explain="Measured or observed results are stronger support than broad opinions.";break;
      case 17:
        skill="Paragraph unity";text="A writer wants to keep a paragraph focused on "+a.topic+". Which sentence should be deleted?";
        options=[unrelated,solution,detail,claim];explain="The unrelated sentence diverts attention from the paragraph's focus.";break;
      case 18:
        skill="Text organization";text="A paragraph contains these sentences: '"+problem+" "+solution+" "+outcome+"' What organizational structure is used?";
        options=["Problem followed by solution and result","Comparison of two unrelated characters","A list of historical dates","A set of definitions for technical terms"];explain="The paragraph introduces an obstacle, explains a response, and describes its outcome.";break;
      case 19:
        skill="Effective openings";text="Which sentence would most effectively introduce an essay about "+a.topic+"?";
        options=[claim,"There are a lot of things about this topic.",unrelated,detail];explain="An opening should present the controlling idea clearly and broadly enough for the paragraph.";break;
      case 20:
        skill="Sentence combining";text="Choose the combination that best shows cause and response: '"+problem+"' '"+solution+"'";
        options=["Because "+lowerFirst(problem.slice(0,-1))+", "+lowerFirst(solution),problem+" "+solution,problem.slice(0,-1)+", "+lowerFirst(solution),"Because "+lowerFirst(solution.slice(0,-1))+", "+lowerFirst(problem)];explain="Because introduces the reason for the response without reversing the causal relationship or creating a comma splice.";break;
      case 21:
        skill="Wordiness";text="Which sentence best replaces the vague statement, 'The "+a.topic+" project did many important things' ?";
        options=[claim,"The project included various activities that were activities.",unrelated,"There are several things to mention about the work."];explain="Precise writing identifies what was accomplished rather than saying only that things occurred.";break;
      case 22:
        skill="Cause and effect";text="Which sentence is best described as the RESULT of the work in this passage? '"+problem+" "+solution+" "+outcome+"'";
        options=[outcome,problem,unrelated,steps[0]];explain="The result occurs after the response and describes what changed.";break;
      case 23:
        skill="Coherent transitions";text="Read this paragraph draft: '"+claim+" "+problem+" ____ "+solution+"' Which connector best links the problem to the response?";
        options=["To address this problem,","By contrast,","For example,","In the same way,"];explain="To address this problem explicitly explains the response to the obstacle.";break;
      default:throw Error("Unknown composition type");
    }
    const item={id:"L"+String(day).padStart(2,"0")+"-"+(practice?"PC":"C")+String(j+1).padStart(2,"0"),
      group:"composition",skill,text:practice?"Guided practice — "+text:text,options,correctIndex:correct,explanation:explain};
    return distinctOptions(rotate(item,day+j+(practice?2:0)));
  }
  const fullDays=[],practiceDays=[];
  for(let d=1;d<=20;d++){
    const u=Array.from({length:30},(_,i)=>usageItem(d,i));
    const s=Array.from({length:10},(_,i)=>spellingItem(d,i));
    const c=Array.from({length:20},(_,i)=>compositionItem(d,i));
    fullDays.push({day:d,durationMinutes:25,groups:SECTION.groups,questions:[...u,...s,...c]});
    const guidedCategories=[
      ["Possessives","Agreement"],["Pronoun case","Pronouns","Pronoun agreement"],["Verb tense","Verb forms","Verb mood"],["Agreement"],["Adjectives","Comparisons"],["Adverbs","Modifiers","Adjectives"],["Prepositions","Fragments","Punctuation"],["Articles","Quantifiers"],["Punctuation","Quotation punctuation"],["Capitalization","Possessives","Quotation punctuation"],["Word choice","Pronouns"],["Verb forms","Pronouns"],["Negatives","Comparisons","Quantifiers"],["Fragments","Run-ons","Punctuation"],["Parallelism","Modifiers"],["Usage","Word choice","Modifiers"],["Agreement","Pronoun case"],["Punctuation","Prepositions"],["Punctuation","Word choice"],["Agreement","Adjectives","Adverbs","Punctuation"]
    ][d-1];
    const targetPool=errors.map((e,i)=>guidedCategories.includes(e[0])?i:-1).filter(i=>i>=0);
    if(targetPool.length<3)throw Error("Insufficient guided skill coverage for day "+d);
    const practice=[...Array.from({length:8},(_,i)=>usageItem(d,i+34,true,targetPool[(i*3+d)%targetPool.length])),...Array.from({length:3},(_,i)=>spellingItem(d,(i+2)%10,true)),...Array.from({length:4},(_,i)=>compositionItem(d,i+2,true))];
    practiceDays.push({day:d,questions:practice});
  }
  return {blueprint:SECTION,fullDays,practiceDays,typos:badSpelling};
};
