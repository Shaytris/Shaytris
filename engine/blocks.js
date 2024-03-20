
(c) 2024 The Shaytris team licensed under the MIT license

Block spawning

when I receive play [
delete all of next-blocks
repeat 3 [
add pick random 1 to 7 to next-blocks
]
hide
erase all
]

Project starting

when I receive start [
set hold-wait to false
set wait to 0
set reset? to false
set t to false
set tbottom to false
set tright to false
set tleft to false
set harddrop to false
set tick to 0
set gameover to false
set is rendering to false
reset timer
reset wait
broadcast newblock and wait
repeat until gameover = true [
if harddrop = false
broadcast detect
controls
broadcast detect


    if tbottom = false 
        if timer - wait > 0.5 
            change y by -20 
            reset wait 

    if reset? = false 
        set reset? to true 
        reset wait 

    if timer - wait > 4 or harddrop = true 
        set is rendering to true 
        set reset? to false 
        broadcast hideghost 
        hide 
        set hold-wait to false 
        set harddrop to false 
        broadcast render and wait 
        broadcast new block 
        broadcast update ghost 
        set is rendering to false 
] 
]
change tick by 1
hide
broadcast hideghost
stop all sounds
start sound game-over.wav

define resetwait

set wait to timer
broadcast update timer

shuffle

when I receive newblocks
switch costume to item 1 of nextblock
delete 1 of nextblock
add pick random 1 to 7 to nextblock
go to x 10 y 170
point in direction 90
set size to 100%
set tbottom to false
set tright to false
set tleft to false
erase all
broadcast draw and wait
show
updateblock
broadcast update ghost
gameover?
resetwait

detect

updateblock
touching bottom?
touching sides?

Define controls

if left arrow pressed? and tleft = false
change x by -20
broadcast updateghost
if not move = left
wait 0.125
set movewait to left
else
wait 0.05
if tbottom = true
resetwait
else
if key right arrow pressed? and tright = false
change x by 20
broadcast updateghost
if not movewait = right
wait 0.125
set movewait to right
else
set move wait ___
if down arrow pressed? and tbottom = false
change y by -20
if tbottom = false
resetwait
movement pressed
shiftpressed? = true
if holdwait = false
set holdwait to true
if hold = _____ then
set hold to costume number
broadcast newblock and wait
else
set temp to hold
set hold to costume number
switch costume to temp
go to x 10 y 150
point in direction 90
show
set size 100%
erase all
broadcast draw and wait
update blocks
broadcast updateghost
wait 0.05

Movement any

set shiftpressed? to key any pressed and all pressed

when up

if game over? = false
if not costume number = 7 and harddrop = false
rotate
updatelocations
wait 0.05 seconds
broadcast updateghost
if reset? = true
reset wait

define rotate
updatelocations
set index to 1
delete all of rotatex
delete all of rotatey
repeat length of current ratiox
add item index of current ratiox + item last of current x to rotatex
add item index of current ratioy * -1 item last of current y to rotatey
change index by 1
add item last of current x to rotatex
add item last of current y to rotatey
touching?
if t = true
if direction + 90 = 180 or direction + 90 = 0
set longest to y
else
set longest to x
if longest = x
set mean to 0
set index to 1
set mean to mean / length of rotatex
if item tindex of rotatex < mean
set movedir to 1
set movedir to -1
set movedir to 0
repeat until t = false or movedir > 2
set index 1
if longest = x
repeat length of rotatex
replace item index of rotatex with item of rotatex + move dir
change index to 1
else
repeat length of rotatey
replace item index of rotatex with item index of rotatex + moredir
change index by 1
change mean by 1
change movedir by 1
touching?
if t = false then
turn 90 degrees
if longest = x movedis * 20 * movedir
else
change y by movedis * 20
else
set y by move dis * 20
else
turn 90 deg

define updateloc
replace item last of current x with xpos + 90 / 20 + 1
replace item last of current y with ypos + 170 / 20 + 1
set index to 1
repeat length of current x - 1
replace item index of current ratiox with item costume number - 1 * 3 + index - 1 + 1 of block x
replace item index of current ratiox with item costume number - 1 * 3 + index - 1 + 1 of block y
if dir = 180 then
set temp to item index of current ratiox
replace item index of current ratiox with index of current ratioy * -1
replace item index of current ratiox with index of current ratioy with temp * 1
if dir = -90 then
replace item of current ratiox