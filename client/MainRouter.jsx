import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./core/Home";
//Added the home for Our Project:
import RPSHome from "./core/RPSHome";
//Added the menu for OUR project:
import RPSMenu from "./core/RPSMenu"
import Users from "./user/Users.jsx";
import Signup from "./user/Signup.jsx";
import Signin from "./lib/Signin.jsx";
import Profile from "./user/Profile.jsx";
import PrivateRoute from "./lib/PrivateRoute.jsx";
import EditProfile from "./user/EditProfile.jsx";
import Menu from "./core/Menu";
import AddItem from "./item/AddItem.jsx";
import AddMatch from"./match/MatchJtesting.jsx";
//import AddMatch from"./match/Addmatch.jsx";

function MainRouter() {
  return (
    <div>
      <RPSMenu />

      <Routes>
        <Route path="/" element={<RPSHome />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/user/edit/:userId"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route path="/user/:userId" element={<Profile />} />
        <Route path="/addItem" element={<AddItem />} />
        <Route path="/addMatch" element={<AddMatch />} />
      </Routes>
    </div>
  );
}

export default MainRouter;
