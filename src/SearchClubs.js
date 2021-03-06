import React, { useState } from "react";
import axios from "axios";
import ClubList from "./ClubList";
import Navigation from "./Navigation";
import firebaseApp from "./firebase";
import "./SearchFilters.css";

function SearchClubs() {
  const [system, setSystem] = useState("ps4");
  const [clubname, setClubname] = useState("");
  const [timezone, setTimezone] = useState("EST");
  const [availablePos, setAvailablePos] = useState("wantany");
  const [clubFilteredArray, setClubFilteredArray] = useState([]);

  const senderFirebaseid = firebaseApp.auth().currentUser.uid;

  function searchHandler(e) {
    e.preventDefault();

    console.log(system + "/" + timezone);

    axios
      .get("http://localhost:5000/clubs/searchclub/" + system + "/" + timezone)
      .then((response) => {
        const clubResponseArray = response.data;
        console.log("clubResponseArray", clubResponseArray);
        var clubFilterer = clubResponseArray.filter(function (club) {
          console.log(availablePos, club[availablePos]);
          return club[availablePos] === "yes";
        });
        console.log("clubFilterer", clubFilterer);

        if (clubResponseArray.length > 0) {
          setClubFilteredArray(clubFilterer);
          console.log("clubFiltererArray", clubFilteredArray);
        }
      })
      .catch((error) => {
        alert("No clubs found :(");
      });
  }

  function searchByClubname(e) {
    e.preventDefault();

    axios
      .get("http://localhost:5000/clubs/searchclubbyname/" + clubname)
      .then((response) => {
        console.log(response);
        const clubResponseArray = response.data;
        if (clubResponseArray.length > 0) {
          setClubFilteredArray(clubResponseArray);
          console.log("clubFiltererArray", clubFilteredArray);
        }
      });
  }

  function systemSwitcher(e) {
    switch (e) {
      case "ps4":
        return "PS4";
      case "xboxone":
        return "Xbox One";
      case "ps5":
        return "PS5";
      case "xbox":
        return "Xbox (4th Gen)";
      case "pc":
        return "PC";
      default:
        return "N/A";
    }
  }

  console.log("clubFilteredArray Outside", clubFilteredArray);

  return (
    <div className="search__container">
      <div className="search__filters__container">
        <h4>Search Clubs</h4>
        <div>
          <select
            className="search__select"
            onChange={(e) => setSystem(e.target.value)}
          >
            <option defaultValue value="ps4">
              PS4
            </option>
            <option value="xboxone">Xbox One</option>
            <option value="ps5">PS5</option>
            <option value="xbox">Xbox (4th Gen)</option>
            <option value="pc">PC</option>
          </select>

          <select
            className="search__select"
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option defaultValue value="EST">
              EST
            </option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div>
          <label>Available Position: </label>
          <select
            className="search__select"
            onChange={(e) => setAvailablePos(e.target.value)}
          >
            <option defaultValue value="wantany">
              ANY
            </option>
            <option value="wantgk">GK</option>
            <option value="wantrb">RB</option>
            <option value="wantcb">CB</option>
          </select>
          <button className="search__select" onClick={searchHandler}>
            ????
          </button>
        </div>

        <div>
          <input
            className="search__select"
            placeholder="EXACT Club Name..."
            onChange={(e) => setClubname(e.target.value)}
          ></input>

          <button className="search__select" onClick={searchByClubname}>
            ????
          </button>
        </div>
      </div>

      <table>
        <tbody>
          {clubFilteredArray.map((clublist) => {
            return (
              <ClubList
                key={clublist._id}
                system={systemSwitcher(clublist.system)}
                clubname={clublist.clubname}
                timezone={clublist.timezone}
                receiverFbid={clublist.managerfirebaseid}
                senderFbid={senderFirebaseid}
              />
            );
          })}
        </tbody>
      </table>
      <Navigation />
    </div>
  );
}

export default SearchClubs;
