# (c) 2024 The Shaytris team licenced under the MIT licence

# Block spawning
when I receive play
[
delete all of next-blocks
repeat 3
[
add pick random 1 to 7 to next-blocks
]
hide
erase all
]

# Project starting
when I receive start
[
set hold-wait to false
set wait to 0
set reset? to false
set t to false
set tbottom to false
set tright false
set tleft false
set harddrop false
set tick 0
set gameover false
set is rendering to false
reset timer
reset wait
brodcast newblock and wait
repeat gameover = true
[
if harddrop = false
brodcast detect
controls
brodcast detect

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
brodcast hideghost
hide
set holdwait tp false
set harddrop to false
brodcast render and wait
brodcast new block
brodcast update ghost
set is rendering? to false
]
]
change tick by 1
hide
brodcast hideghost
stop all sounds
start sound game-over.wav

# define resetwait
set wait to timer
brodcast update timer

# shuffle

when I receive newblocks
switch costume to item 1 of nextblock
delete 1 of nextblock
add pick random 1 to 7 to next block
go to x 10 y 170
point in direction 90
set size to 100%
set tbottom to false
set tright to false
set tleft to false
erase all
brodcast draw and wait
show
updateblock
brodcast update ghost
gameover?
resetwait

# detect
updateblock
touchingbottom?
touching sides?

# Define controls
if left arrow pressed? and tleft = false
change x by -20
brodcast updateghost
if not move = left
wait 0.125
set movewait to left
else
wait 0.05
if tbottom = true
resetwait
else
if key right arrow pressed? and tright = false
change x  by 20
brodcast updateghost
if not movewait = right
wait 0.125
set movewait to right
else
set move wait ___
if down arrow pressed? and  tbottom = flase
change y by -20
if tbottom = false then
resetwait
movement pressed
shiftpressed? = true
if hodlwait = false
set holdwait to true
if hold = _____ then
set hold to costume number
brodcast newblock and wait
else
set temp to hold
set hold to costume number
switch costume to temp
go tp x 10 y 150
point in dierection 90
show
set size 100%
set all to defualt
erase all
brodcast draw and wait 
update blocks
brodcast updateghost
wait 0.05

# Movement any
set shiftpressed? to key any pressed and all pressed

# when up
if game ver? = false
if not costume number = 7 and harddrop = false
rotate
updatelocations
wait 0.05 seconds
brodcast updateghost
if reset? = true
reset wait

define rotate
updatelocations
set index to 1
delete all of rotatex
delete all of rotatey
repeat length of curentratiox
add item index of curentratiox + item last of curentx to rotatex
add item index of curentratioy *-1 item last of curenty to rotatey
change index by 1
add item last of curentx to rotatex
add ietm last of curenty to rotatey
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
set movedir -1
set movedir to 0
repeat until t = false or movedir > 2
set index 1
if longest = x
repeat lenghth of rotatex
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
turn 90 der
if longest = x movedis * 20 * movedir
else
change y by movedis * 20
else
set y by move dis * 20
else
turn 90 deg

define updateloc
replace item last of curentx with  xpos + 90 / 20 + 1
replace item last of curenty with  ypos + 170 / 20 + 1
set index to 1
repeat length of curentx - 1
replace iteem index of curentratiox with item coustume number - 1 * 3 + index - 1 + 1 of block x
replace iteem index of curentratiox with item coustume number - 1 * 3 + index - 1 + 1 of block y
if dir = 180 then
set temp to item index of curentratiox
replace item index of curentratiox with index of curentratioy * -1
replace item index of curentratiox with index of curentratioy with temp * 1
if dir = -90 then
replace item of curentratiox
