// =========================
// データ
// =========================

let works = [];
let syndromes = [];
let lifepaths = {};

// =========================
// 要素取得
// =========================

const workSelect = document.getElementById("workSelect");

const bodyValue = document.getElementById("bodyValue");
const senseValue = document.getElementById("senseValue");
const mindValue = document.getElementById("mindValue");
const socialValue = document.getElementById("socialValue");

const skillBox = document.getElementById("skillBox");


// =========================
// 初期化
// =========================

window.addEventListener("DOMContentLoaded", init);

async function init(){

    await loadWorks();
    await loadSyndromes();
    await loadLifepaths();

}

// =========================
// ワークス読込
// =========================

async function loadWorks(){

    try{

        const response = await fetch("data/works.json");

        works = await response.json();

        createWorkList();

    }

    catch(error){

        console.error(error);

        alert("works.json を読み込めませんでした");

    }

}


// =========================
// ワークス一覧作成
// =========================

function createWorkList(){

    workSelect.innerHTML =
    `<option value="">選択してください</option>`;

    works.forEach(work=>{

        const option=document.createElement("option");

        option.value=work.id;

        option.textContent=work.name;

        workSelect.appendChild(option);

    });

}


// =========================
// ワークス変更
// =========================

workSelect.addEventListener("change",()=>{

    const work=works.find(w=>w.id===workSelect.value);

    if(!work){

        clearStatus();

        return;

    }

 updateAbility();

drawSkills(work);

updateOrganization();

});


// =========================
// 能力値
// =========================

function drawAbility(work){

    bodyValue.textContent =
    work.ability.body;

    senseValue.textContent =
    work.ability.sense;

    mindValue.textContent =
    work.ability.mind;

    socialValue.textContent =
    work.ability.social;

}


// =========================
// 技能
// =========================

function drawSkills(work){

    skillBox.innerHTML="";

    work.skills.forEach(skill=>{

        const li=document.createElement("li");

        li.textContent=
        `${skill.name}　Lv${skill.level}`;

        skillBox.appendChild(li);

    });

}


// =========================
// リセット
// =========================

function clearStatus(){

    bodyValue.textContent=0;

    senseValue.textContent=0;

    mindValue.textContent=0;

    socialValue.textContent=0;

    skillBox.innerHTML="";

}

// =========================
// シンドローム読込
// =========================

async function loadSyndromes(){

    try{

        const response = await fetch("data/syndromes.json");

        syndromes = await response.json();

        createSyndromeList();

    }

    catch(error){

        console.error(error);

    }

}

// =========================
// ライフパス読込
// =========================

async function loadLifepaths(){

    try{

        const response = await fetch("data/lifepaths.json");

        lifepaths = await response.json();

        createLifepathList();

    }

    catch(error){

        console.error(error);

        alert("lifepaths.json を読み込めませんでした");

    }

}

// =========================
// ライフパス生成
// =========================

function createLifepathList(){

    fillSelect("birth", lifepaths.birth.normal);

    fillSelect("experience", lifepaths.experience.student);
document
    .getElementById("experienceType")
    .addEventListener("change", changeExperienceType);

    fillSelect("encounter", lifepaths.encounter.normal);

    fillSelect("awakening", lifepaths.awakening);

    fillSelect("impulse", lifepaths.impulse);

}

// =========================
// Selectへ追加
// =========================

function fillSelect(id,data){

    const select=document.getElementById(id);

    select.innerHTML="";

    data.forEach(item=>{

        const option=document.createElement("option");

        option.value=item.id;

        option.textContent=item.name;

        select.appendChild(option);

    });

}

//=========================
// 経験切替
//=========================

function changeExperienceType(){

    const type =
        document.getElementById("experienceType").value;

    // 経験
    fillSelect(
        "experience",
        lifepaths.experience[type]
    );

    // 出自
    if(type==="rb"){

        fillSelect(
            "birth",
            lifepaths.birth.rb
        );

    }else{

        fillSelect(
            "birth",
            lifepaths.birth.normal
        );

    }

// 邂逅・欲望
const encounterLabel =
    document.getElementById("encounterLabel");

if(type==="rb"){

    encounterLabel.textContent = "邂逅";

    fillSelect(
        "encounter",
        lifepaths.encounter.rb
    );

}else if(type==="fh"){

    encounterLabel.textContent = "欲望";

    fillSelect(
        "encounter",
        lifepaths.desire
    );

}else{

    encounterLabel.textContent = "邂逅";

    fillSelect(
        "encounter",
        lifepaths.encounter.normal
    );

}

   }


function updateOrganization(){

    const work = works.find(
        w => w.id === workSelect.value
    );

    if(!work) return;

    const type =
        document.getElementById("experienceType");

    switch(work.category){

        case "UGN":
            type.value = "ugn";
            break;

        case "FH":
            type.value = "fh";
            break;

        case "RB":
            type.value = "rb";
            break;

        case "裏社会":
            type.value = "underworld";
            break;

        default:
            type.value = "general";
            break;

    }

    changeExperienceType();

}

// =========================
// プルダウン作成
// =========================

function createSyndromeList(){

    const selects=[

        document.getElementById("syndrome1"),
        document.getElementById("syndrome2"),
        document.getElementById("syndrome3")

    ];

    selects.forEach(select=>{

        select.innerHTML="";

        const none=document.createElement("option");

        none.value="";

        none.textContent="なし";

        select.appendChild(none);

        syndromes.forEach(s=>{

            const option=document.createElement("option");

            option.value=s.id;

            option.textContent=s.name;

            select.appendChild(option);

        });

    });

}

// =========================
// 能力値計算
// =========================

function updateAbility() {

const work = works.find(
    w => w.id === workSelect.value
);

let body = 0;
let sense = 0;
let mind = 0;
let social = 0;

if (work) {

    body = work.ability.body;
    sense = work.ability.sense;
    mind = work.ability.mind;
    social = work.ability.social;

}


    // 選択されたシンドロームを取得
    const selected = [];

    ["syndrome1", "syndrome2", "syndrome3"].forEach(id => {

        const value = document.getElementById(id).value;

        if (!value) return;

        const syndrome = syndromes.find(
            s => s.id === value
        );

        if (syndrome) {

            selected.push(syndrome);

        }

    });


    // ピュアブリード
    if (selected.length === 1) {

        body += selected[0].ability.body * 2;
        sense += selected[0].ability.sense * 2;
        mind += selected[0].ability.mind * 2;
        social += selected[0].ability.social * 2;

    }

    // クロスブリード
    else if (selected.length === 2) {

        selected.forEach(s => {

            body += s.ability.body;
            sense += s.ability.sense;
            mind += s.ability.mind;
            social += s.ability.social;

        });

    }

    // トライブリード
    else if (selected.length >= 3) {

        for (let i = 0; i < 2; i++) {

            body += selected[i].ability.body;
            sense += selected[i].ability.sense;
            mind += selected[i].ability.mind;
            social += selected[i].ability.social;

        }

    }

    bodyValue.textContent = body;
    senseValue.textContent = sense;
    mindValue.textContent = mind;
    socialValue.textContent = social;

}

document
.querySelectorAll(
"#syndrome1,#syndrome2,#syndrome3"
)
.forEach(select=>{

    select.addEventListener(
        "change",
        updateAbility
    );

});


// =========================
// 保存・読込・初期化
// =========================

const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const resetBtn = document.getElementById("resetBtn");

saveBtn.addEventListener("click", saveCharacter);
loadBtn.addEventListener("click", loadCharacter);
resetBtn.addEventListener("click", resetCharacter);

function saveCharacter() {

    const data = {};

    document.querySelectorAll("input, select, textarea").forEach(el => {

        if (el.id) {

            data[el.id] = el.value;

        }

    });

    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "DX3rd_Character.json";
    a.click();

    URL.revokeObjectURL(url);

}

function loadCharacter() {

    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".json";

    input.onchange = e => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

reader.onload = () => {

    let data;

    try {

        data = JSON.parse(reader.result);

    } catch (error) {

        alert("JSONファイルの読み込みに失敗しました。\nファイルが壊れているか、形式が正しくありません。");
        console.error(error);
        return;

    }

    Object.keys(data).forEach(id => {

                const el = document.getElementById(id);

                if (el) {

                    el.value = data[id];

                }

            });

            updateOrganization();
            updateAbility();

            const work = works.find(
                w => w.id === workSelect.value
            );

            if (work) {

                drawSkills(work);

            }

        };

        reader.readAsText(file, "UTF-8");

    };

    input.click();

}

function resetCharacter() {

    if (!confirm("入力内容を初期化しますか？")) return;

    document.querySelectorAll("input, textarea").forEach(el => {

        el.value = "";

    });

    document.querySelectorAll("select").forEach(el => {

        el.selectedIndex = 0;

    });

    clearStatus();
    updateAbility();

}