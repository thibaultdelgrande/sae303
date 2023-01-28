//Thibault Delgrande 2022
//intégration du svg dans le dom

/*
1 = Nathalie ARTHAUD
2 = Fabien ROUSSEL
3 = Emmanuel MACRON
4 = Jean LASSALLE
5 = Marine LE PEN
6 = Eric ZEMMOUR
7 = Jean-Luc MÉLENCHON
8 = Anne HIDALGO
9 = Yannick JADOT
10 = Valérie PÉCRESSE
11 = Phillippe POUTOU
12 = Nicolas DUPONT-AIGNAN


dep = code de departement
id_com = code de commune
nom = libellé de commune
ins = incrits
abs = abstentions
vot = votants
blc = blancs
nul = nuls
bna = blancs + nuls + abstention
*/



//récupération des valeurs
let json;
let active = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12","bna"];
let equivalent = {"1":"Nathalie ARTHAUD","2":"Fabien ROUSSEL","3":"Emannuel MACRON","4":"Jean LASSALLE","5":"Marine LE PEN","6":"Eric ZEMMOUR","7":"Jean-Luc MÉLENCHON","8":"Anne HIDALGO","9":"Yannick JADOT","10":"Valérie PÉCRESSE","11":"Phillippe POUTOU","12":"Nicolas DUPONT-AIGNAN","bna":"Blancs, nuls et abstentions"}

if(window.location.href.split("?").length>1){
    active2 = [];
    active.forEach(element => {
        active2.push(element);
    });
    active.forEach(element => {
        if (window.location.href.split("?")[1].includes(element+"=false")){
            active2.splice(active2.indexOf(element),1)
        }
    });
    active=active2;
}

//récuperer les résultats france entière

var france;

async function getResults() {
    json = await fetch('data/france.json').then( r=> r.json());
    france = json[0];
    france["bna"] = Number(france["blc"]) + Number(france["nul"]) + Number(france["abs"]);
    let total = 0;
    active.forEach(e => {
        total += Number(france[e]);
    })
    france["total"] = total;
}

//affichage des résultats france entière

function afficheFrance(){
    for (element in france) {
        if (active.includes(element))
        {
            document.getElementById("voix"+element).innerText = france[element].toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
            document.getElementById("pourcentage"+element).innerText = (france[element]/france["total"]*100).toFixed(2).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + "%";
        }
        else
        {
            if(document.getElementById(element)){
                document.getElementById(element).remove();
            }
        }
    };
}

//comparaison avec 2017

async function getResults2017() {
    json = await fetch('data/2017.json').then( r=> r.json());
    f2017 = json[0];
    f2017["bna"] = Number(f2017["blc"]) + Number(f2017["nul"]) + Number(f2017["abs"]);
    let total = 0;
    active.forEach(e => {
        total += Number(f2017[e]);
    })
    f2017["total"] = total;

    noms = [];
    active.forEach( element =>{
        noms.push(equivalent[element]);
    });
    r2022 = [];
    active.forEach( element =>{
        r2022.push(france[element]);
    });
    r2017 = [];
    active.forEach( element =>{
        r2017.push(f2017[element]);
    });


    const data = {
        labels: noms,
        datasets: [{
        label: '2022',
        data: r2022,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
        }, {
        label: '2017',
        data: r2017,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
    };   
    const config = {
        type: 'radar',
        data: data,
        options: {
          elements: {
            line: {
              borderWidth: 3
            }
          }
        },
      };
      new Chart(document.getElementById("myChart"), config);

}

//affichage des candidats, la taille dépendante du résultat


function affiches(){
    for (element in france) {
        if (active.includes(element))
        {
            document.getElementById("affiche"+element).style.width = (france[element])/france["total"]*100 + '%';
        }
        else
        {
            if(document.getElementById("affiche"+element)) {
                document.getElementById("affiche"+element).remove();
            }
        }
        
    };
}

//affichage de la carte

async function setupSVG() {
    const map = await fetch('map.svg').then(r => r.text());
    document.getElementById('map').innerHTML = map;
}

async function setClassCommune() {
    let communes_gagnees = {"total":0};
    active.forEach(element => {
        communes_gagnees[element] = 0;
    });
    json = await fetch('data/commune.json').then(r => r.json());
    json.forEach(element => {
        element["bna"] = Number(element["blc"]) + Number(element["nul"]) + Number(element["abs"]);
        let max = 0;
        for (const i of active) {
            if (element[i]>=max)
            {
                max = element[i];
                value_max = i;
            }
        }
        if (max == 0) {
            value_max = "bna";
        };
        communes_gagnees[value_max] += 1;
        communes_gagnees["total"] += 1;
        const dom = document.getElementById(element["dep"].toString().padStart(2,"0")+element["id_com"].toString().padStart(3,"0"));
        if (dom) {
            dom.classList.add("c"+value_max.toString());
            dom.title = equivalent[value_max.toString()]
        } else {
            console.warn('missing on map', element);
        }
    });
    console.log(communes_gagnees)
    Object.keys(communes_gagnees).forEach(element => {
        if (active.includes(element))
        {
            document.getElementById("cg"+element).innerText = communes_gagnees[element].toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
            document.getElementById("pcg"+element).innerText = (communes_gagnees[element]/communes_gagnees["total"]*100).toFixed(2).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + "%";
        }
        else {
            console.log(element,"lcg"+element,document.getElementById("lcg"+element))
            if(document.getElementById("lcg"+element)) {
                document.getElementById("lcg"+element).remove();
            }
        }
    });
}

getResults().then(afficheFrance).then(affiches).then(getResults2017).then(setupSVG).then(setClassCommune);