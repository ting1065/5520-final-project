# 5520 Final project 
Group 8: Fengting Tang, Chenlei Luo

## App name  
Memory Master

## Stage
Iteration 1  

## Data model  
To be optimized...
### Collections  
1. users  
fields: id, name, avatar, email, win, lose  

2. puzzles  
fields: userId(id from "users" collection), coverImageUri, puzzle, win, lose  

3. activities  
fields: title, imageUri, intro, organizer(id from "users" collection), participants(list of id from "users collection")  

### Storage  
used to save users' avatars and cover images of activities  
folders: avatars, activities

## Description   
Welcome to our innovative mobile app that blends the thrill of a memory puzzle game with the social connections of a dynamic platform. Challenge yourself with mind-boggling puzzles created by fellow players or showcase your brilliance by designing tricky puzzles to stump others.  

Connect with like-minded individuals, share your achievements, and participate in on-site activities to make new friends. Our map-based interface lets you discover the clever minds in your neighborhood and compete for the title of the smartest!  

Are you up for the challenge? Join now and prove your wit! Beat the competition and earn the bragging rights you deserve!  

## Slogan  
Challenge, Connect, Conquer! Memory puzzles & social fun!  

## Target Users   
People aged over 12 who are brain training fans  

