let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  { name: "stick", power: 5 },
  { name: "dagger", power: 30 },
  { name: "claw hammer", power: 50 },
  { name: "sword", power: 100 }
];

const monsters = [
  { name: "slime", level: 2, health: 15 },
  { name: "fanged beast", level: 8, health: 60 },
  { name: "dragon", level: 20, health: 300 }
];

const locations = [
  {
    name: "town square",
    button_text: ["Go to store", "Go to cave", "Fight dragon"],
    button_functions: [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store.\""
  },
  {
    name: "store",
    button_text: ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    button_functions: [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    button_text: ["Fight slime", "Fight fanged beast", "Go to town square"],
    button_functions: [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    button_text: ["Attack", "Dodge", "Run"],
    button_functions: [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    button_text: ["Go to town square", "Go to town square", "Go to town square"],
    button_functions: [goTown, goTown, goTown],
    text: "The monster screams \"Arg!\" as it dies. You gain experience points and find gold."
  },
  {
    name: "lose",
    button_text: ["Replay?", "Replay?", "Replay?"],
    button_functions: [restart, restart, restart],
    text: "You die."
  },
  {
    name: "win",
    button_text: ["Replay?", "Replay?", "Replay?"],
    button_functions: [restart, restart, restart],
    text: "You WON."
  }
];

button1.onclick = () => locations[0].button_functions[0]();
button2.onclick = () => locations[0].button_functions[1]();
button3.onclick = () => locations[0].button_functions[2]();

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location.button_text[0];
  button2.innerText = location.button_text[1];
  button3.innerText = location.button_text[2];
  button1.onclick = () => location.button_functions[0]();
  button2.onclick = () => location.button_functions[1]();
  button3.onclick = () => location.button_functions[2]();
  text.innerText = location.text;
}

function goTown() {
  update(locations[0]);
  document.getElementById("dragon").style.display = "none";
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      let newWeapon = weapons[currentWeapon].name;
      inventory.push(newWeapon);
      text.innerText = "You now have a " + newWeapon + ". In your inventory you have: " + inventory;
      goldText.innerText = gold;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    inventory.shift();
    goldText.innerText = gold;
    text.innerText = "You sold a weapon. In your inventory: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;

  const dragon = document.getElementById("dragon");
  dragon.style.display = fighting === 2 ? "block" : "none";
}

function attack() {
  if (fighting === 2) {
    const dragonImg = document.getElementById("dragonImage");
    dragonImg.classList.add("attack");
    setTimeout(() => dragonImg.classList.remove("attack"), 400);
  }

  text.innerText = `The ${monsters[fighting].name} attacks. You attack it with your ${weapons[currentWeapon].name}.`;
  health -= monsters[fighting].level;
  monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;

  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name + ".";
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}
