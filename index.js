const playersData = require("./data/players.json");
const teamsData = require("./data/teams.json");
const nationsData = require("./data/nations.json");

const PLAYERS_ID = 1;
const TEAMS_ID = 2;
const NATIONS_ID = 3;
const SEARCH = 1;
const LIST_OF_SEARCHABLE_FIELD = 2;

const getKeyOfData = (option) => {
  if (option !== PLAYERS_ID && option !== TEAMS_ID && option !== NATIONS_ID)
    return;
  let uniqueKeys;
  switch (option) {
    case PLAYERS_ID:
      const keyOfPlayer = playersData.map((player) => Object.keys(player));
      uniqueKeys = [...new Set(keyOfPlayer.flat())];
      break;
    case TEAMS_ID:
      const keyOfTeam = teamsData.map((player) => Object.keys(player));
      uniqueKeys = [...new Set(keyOfTeam.flat())];
      break;
    case NATIONS_ID:
      const keyOfNation = nationsData.map((player) => Object.keys(player));
      uniqueKeys = [...new Set(keyOfNation.flat())];
      break;

    default:
      break;
  }
  return uniqueKeys;
};
const findData = (option, data, key, value) => {
  switch (option) {
    case PLAYERS_ID:
      if (typeof key === "object") {
        const listKeyOfInput = Object.keys(key);
        return data.filter((item) => {
          return listKeyOfInput.every((value) => item[value] === key[value]);
        });
      } else {
        return data.filter((item) => {
          const listKey = Object.keys(item);
          return listKey.some((item) => item === key) && item[key] === value;
        });
      }
    case TEAMS_ID:
      if (typeof key === "object") {
        const listKeyOfInput = Object.keys(key);
        return data.filter((item) => {
          return listKeyOfInput.every((value) => item[value] === key[value]);
        });
      } else {
        return data.filter((item) => {
          const listKey = Object.keys(item);
          return listKey.some((item) => item === key) && item[key] === value;
        });
      }
    case NATIONS_ID:
      if (typeof key === "object") {
        const listKeyOfInput = Object.keys(key);
        return data.find((item) => {
          return listKeyOfInput.every((value) => item[value] === key[value]);
        });
      } else {
        return data.find((item) => {
          const listKey = Object.keys(item);
          return listKey.some((item) => item === key) && item[key] === value;
        });
      }
    default:
      break;
  }
};

const findNation = (nationId) => {
  return nationsData.find((nation) => nation._id === nationId);
};
const findTeam = (teamId) => {
  return teamsData.find((team) => team._id === teamId);
};
const findPlayers = (key, value, isNation) => {
  return playersData.filter((player) => {
    if (typeof key === "object") {
      return player.team_id === value || player.nation_id === value;
    } else {
      return isNation ? player.nation_id === value : player.team_id === value;
    }
  });
};

const queryAndMapData = (option, dataDetail, key) => {
  let nation;
  let players;
  switch (option) {
    case PLAYERS_ID:
      return dataDetail.map((item) => {
        const nation = findNation(item.nation_id);
        const playerOfTeam = findTeam(item.team_id);
        return {
          ...item,
          nation,
          playerOfTeam,
        };
      });
    case TEAMS_ID:
      if (typeof key === "object") {
        return dataDetail.map((data) => {
          nation = findNation(data.nation_id);
          const players = findPlayers(key, data._id).map(
            (player) => player.name
          );
          return {
            ...data,
            nation,
            players,
          };
        });
      } else {
        return dataDetail.map((data) => {
          const players = findPlayers(key, data._id).map(
            (player) => player.name
          );
          const league = findNation(data.nation_id)
          return {
            ...data,
            ...league,
            players,
            team_name:data.name,
            team_value:data.value,
            id_club:data._id,
          };
        });
      }
    case NATIONS_ID:
      players = findPlayers(key, dataDetail._id, true).map((player) => {
        const team = findTeam(player.team_id);
        return {
          ...player,
          ...team,
          namePlayer: player.name,
        };
      });

      return {
        ...dataDetail,
        players,
      };

    default:
      break;
  }
};

const findKey = (listKey, key) => {
  if (typeof key === "object") {
    const listKeyOfInput = Object.keys(key);
    return listKeyOfInput.every((value) => {
      if (!listKey.includes(value)) {
        printNotFound(`Key:${value} không hợp lệ`);
        return false;
      } else {
        return true;
      }
    });
  } else {
    return listKey.find((item) => item === key);
  }
};

const printNotFound = (message) => {
  console.log(message);
};

const search = (option, key, value) => {
  if (option !== PLAYERS_ID && option !== 2 && option !== 3)
    return printNotFound("Lựa chọn không hợp lệ");
  let keys = getKeyOfData(option);
  let getKey = findKey(keys, key);
  if (typeof getKey === "boolean") {
    if (!getKey) return getKey;
    if (getKey) getKey = key;
  } else {
    if (!getKey) return printNotFound("Không tìm thấy trường dữ liệu");
  }

  switch (option) {
    case PLAYERS_ID:
      const players = findData(option, playersData, key, value);
      if (players.length === 0)
        return printNotFound("Không tìm thấy dữ liệu cầu thủ");
      return queryAndMapData(option, players, key);
    case TEAMS_ID:
      const detailTeam = findData(option, teamsData, key, value);
      if (!detailTeam) return printNotFound("Không tìm thấy dữ liệu đội bóng");

      return queryAndMapData(option, detailTeam, key);
    case NATIONS_ID:
      const detailNation = findData(option, nationsData, key, value);
      if (!detailNation)
        return printNotFound("Không tìm thấy dữ liệu đội tuyển quốc gia");
      return queryAndMapData(option, detailNation, key);

    default:
      break;
  }
};

const selectSearchType = (selectId, option, key, value) => {
  if (selectId !== SEARCH && selectId !== LIST_OF_SEARCHABLE_FIELD)
    return printNotFound("Lựa chọn tìm kiếm này không hợp lệ");
  return search(option, key, value);
};
/** ---------------------------------------- SEARCH ------------------------ */
// VALID
console.log(selectSearchType(SEARCH, PLAYERS_ID, "pos1", "RW"));
console.log(selectSearchType(SEARCH, TEAMS_ID, "nation_id", 63));
console.log(selectSearchType(SEARCH, NATIONS_ID, "value", "argentina"));

// INVALID
console.log(selectSearchType(SEARCH, PLAYERS_ID, "367t318", "iuewrhwei"));
console.log(selectSearchType(SEARCH, PLAYERS_ID, "pos1", "RWWWWW"));
console.log(selectSearchType(SEARCH, TEAMS_ID, "valueeeeeeeeeee", "arsenal"));
console.log(
  selectSearchType(SEARCH, TEAMS_ID, "valueeeeeeeeeee", "fkjdghfdshgnofds")
);
console.log(
  selectSearchType(SEARCH, NATIONS_ID, "value", "dfkjgjdoslgnljdasnfa")
);
console.log(
  selectSearchType(SEARCH, NATIONS_ID, "valuesdhfbksdbfksdj", "argentina")
);

// /** ---------------------------------------- LIST OF SEARCHABLE FIELDS ------------------------ */

// // VALID
console.log(
  selectSearchType(LIST_OF_SEARCHABLE_FIELD, PLAYERS_ID, {
    pos1: "RW",
    uid: "zpddddlj",
    nation_id: 101,
  })
);

console.log(
  selectSearchType(LIST_OF_SEARCHABLE_FIELD, TEAMS_ID, {
    nation_id: 63,
    value: 'arsenal',
    name: 'Arsenal',
  })
);

console.log(
  selectSearchType(LIST_OF_SEARCHABLE_FIELD, NATIONS_ID, {
    _id: 156,
    value: "portugal",
    name: "Portugal",
  })
);

// INVALID

console.log(
  selectSearchType(LIST_OF_SEARCHABLE_FIELD, PLAYERS_ID, {
    uid: "lzwwavjo",
    pos1uihfdsiufns: "CDM",
    pos2: "CM",
    pos1val: 68,
    pos2val: 66,
    team_id: 95,
    liveperfamount: "0",
    update_statchange: "0",
    all_statchange: "0",
    name: "Samú Costa",
    pos: "CDM",
    year: "300",
    skill_level: "2",
    pricekr: 0,
    attrA: 5,
    attrB: 68,
    attrC: 74,
    year_short: "LIVE",
    nation_id: 156,
  })
);

console.log(
  selectSearchType(LIST_OF_SEARCHABLE_FIELD, PLAYERS_ID, {
    pos1: "RW",
    uid: "zpddddljdasfd",
    nation_id: 101,
  })
);

console.log(
  selectSearchType(LIST_OF_SEARCHABLE_FIELD, TEAMS_ID, {
    nation_idsd: 63,
    _id: 1,
    value: "arsenal1",
    name: "Arsenal",
  })
);

console.log(
  selectSearchType(LIST_OF_SEARCHABLE_FIELD, TEAMS_ID, {
    nation_id: 63,
    _id: 1,
    value: "arsenal1",
    name: "Arsenal",
  })
);

console.log(
  selectSearchType(LIST_OF_SEARCHABLE_FIELD, NATIONS_ID, {
    _idddsad: 156,
    value: "portugal",
    name: "Portugal",
  })
);

console.log(
  selectSearchType(LIST_OF_SEARCHABLE_FIELD, NATIONS_ID, {
    _id: 12343256,
    value: "portugal",
    name: "Portugal",
  })
);
