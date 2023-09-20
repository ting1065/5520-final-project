# Memory Master Mobile Game
Fengting Tang, Chenlei Luo

## App name  
Memory Master

## Stage
Iteration 3  

- added notification feature
- enabled account deletion along with clearing all corresponding data and storage
- enhanced other functionalities
- optimized styling

## Contribution
Fengting Tang  
Mainly responsible for functionalities and data management, including integrating firebase services, designing data model and corresponding CRUD function, and implementing functionalities of all components.

Chenlei Luo  
Mainly responsible for component design and implementation, including designing the structures of all the screens and components, testing all the functionalities, and implementing the styling of all components.

## Demo video

[Video Link](https://www.youtube.com/watch?v=KYIEmXL1Pc4)

## UI
1. Login Page
<img src="/resources/login_page.PNG" alt="Login Page image" width="200"/>

2. Signup Page
<img src="/resources/register_page.PNG" alt="Signup Page image" width="200"/>

3. Find Page(list mode)
<img src="/resources/find_page_list_mode.PNG" alt="Find Page(list mode) image" width="200"/>

4. Find Page(Map mode)
<img src="/resources/find_page_map_mode.PNG" alt="Find Page(Map mode) image" width="200"/>

5. Other player info Page(after clicking user marker)
<img src="/resources/other_player_info.PNG" alt="Other player info Page(after clicking user marker) image" width="200"/>

6. Design Page
<img src="/resources/design_page.PNG" alt="Design Page image" width="200"/>

7. Activity Page
<img src="/resources/activity_page.PNG" alt="Activity Page image" width="200"/>

8. Profile Page
<img src="/resources/profile_page.PNG" alt="Profile Page image" width="200"/>

9. Game Page
<img src="/resources/game_page.PNG" alt="Game Page image" width="200"/>

10. Puzzle Editor
<img src="/resources/puzzle_editor.PNG" alt="Puzzle Editor image" width="200"/>

11. Activity Editor
<img src="/resources/activity_editor.PNG" alt="Activity Editor image" width="200"/>

## Data model  

### Collections  
1. users: 
- id
- name
- avatar
- email
- win
- lose
- location
- score

2. puzzles:
- userId (id from "users" collection)
- coverImageUri
- puzzle
- win
- lose
- winners (list of id from from "users" collection)

3. activities:
- title
- imageUri
- intro
- organizer (id from "users" collection)
- participants (list of id from "users" collection)  
- date
- usersToRemind (list of id from "users" collection) 

### Storage  
used to save users' avatars and cover images of activities  
folders: avatars, activities

## Description   
Welcome to our innovative mobile app that blends the thrill of a memory puzzle game with the social connections of a dynamic platform. Challenge yourself with mind-boggling puzzles created by fellow players or showcase your brilliance by designing tricky puzzles to stump others.  

Connect with like-minded individuals, share your achievements, and participate in on-site activities to make new friends. Our map-based interface lets you discover the clever minds in your neighborhood and compete for the title of the smartest!  

Are you up for the challenge? Join now and prove your wit! Beat the competition and earn the bragging rights you deserve!  

## Slogan  
Challenge, Connect, Conquer! Memory puzzles & social fun!  

## Target users   
People aged over 12 who are brain training fans  

