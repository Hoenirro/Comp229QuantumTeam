const createMatch = async (match) => {
    try {
      let response = await fetch("/api/matches/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(match),
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };
  
  const listMatches = async (signal) => {
    try {
      let response = await fetch("/api/match/", {
        method: "GET",
        signal: signal,
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };
  
  const readMatch = async (params, signal) => {
    try {
      let response = await fetch("/api/matches/" + params.matchId, {
        method: "GET",
        signal: signal,
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };
  
  const updateMatch = async (params, match) => {
    try {
      let response = await fetch("/api/matches/" + params.matchId, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(match),
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };
  
  const removeMatch = async (params) => {
    try {
      let response = await fetch("/api/matches/" + params.matchId, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };
  
  export { createMatch, listMatches, readMatch, updateMatch, removeMatch };