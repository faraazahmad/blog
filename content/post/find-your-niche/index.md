---
title: "Try Different Things"
date: 2024-06-10T20:11:27+05:30
tags: ['career', 'life']
---

> You can't connect the dots looking forward; you can only connect them looking backwards. So you have to trust that 
>the dots will somehow connect in your future. You have to trust in something - your gut, destiny, life, karma, whatever
>. This approach has never let me down, and it has made all the difference in my life.
>
>-- Steve Jobs

I've been wanting to write this blog post for a few years now, but I've never had the right kind of experience to 
convince myself that I'm the right person to do so. 

You see, I've been interested in computers for as long as I can remember.
It started off with playing video games, entering cheat codes in Grand Theft Auto, editing the config files in games
to mess around with them, downloading website templates and messing up the CSS, it goes on. So when high school ended 
it was pretty clear to me that I wanted to do something with software, I just didn't know what. 

So, over the past couple of years I have been trying to explore areas in software development that fascinate me. Here
are some things I have tried and I think you should too:

## Game development

Like most people I know in tech, video games are what got them into computers. Somewhere along the way, I believe 
every developer tries their hand at making a game. Maybe it was nostalgia, fun or the chance to recreate something
like my favourite games, I knew I wanted to try building my own game. 

I searched for popular game engines, tried their tutorials, and after lots of trying and failing I settled on Godot. I 
started making games that were similar to the ones I enjoyed as a kid -- Grand Theft Auto, FIFA, Need For Speed, Prince
of Persia.

**Rookie mistake.**

While developing a game you need to design characters, write code, write a story, implement animations, interactions,
inventory, music, sound effects, A/B testing with real beta testers, market your game

and it is... everything.

Your first game should probably be tic-tac-toe, or pacman or something similar. It should be extremely simple to
implement, and be a safe space for you to learn your game dev environment.

{{<twitter 1567601173276008450>}}

You only make your life worse by starting out with a game that has a massive scope. There's a reason that even massive
game studios with all the budget and expertise in the world, require their employees to undergo "crunch periods" (Where they work on
the games non-stop, sleep in their offices, and don't see their families for weeks). Most people start
out learning game-dev with these massive ideas they have for games, and they burn out trying to learn and build 
everything.

I did it too, guess what happened next!

Oh well, onto the next thing.

## Web development

Look, I've been fooling around with HTML/CSS since I was 9. 

I was there when the HTML5 and CSS3 launch was the big thing.

I remember vividly that I had once stayed home from school because of a fever. When I felt slightly better, I 
hopped onto https://w3schools.com to do a JavaScript quiz.

![HTML5UP](html5up.png)

I was obssessed with different website templates, all of their unique designs with CSS and their interativity using
jQuery. I used to download templates from [HTML5Up](https://html5up.net) and mess around with them all day, 
it was the best thing ever. 

This is probably also why I am usually confused when people say CSS is hard. You can code Djikstra's graph search 
algorithm from scratch but you don't know how Cascading Style Sheets (CSS)... cascade? Please.

**Learn your tools.**

Anyways, at the end of high school, I wanted to take my knowledge further in this area. I already knew a bit of
JavaScript, so I didn't need much convincing to be intrigued by Nodejs. Nodejs had been out for a while, so there were
more than enough libraries & frameworks like Express, Angular, Ember, etc. But it didn't matter who made the tutorial, 
all of it came with tons of manual configuration. 

**It was too much configuration, I was repulsed.**

I just wanted to build stuff, I wasn't interested in setting up 10 tools before I can return a Hello World from an API
endpoint. I searched around for something that didn't need so much **configuration**, which is probably what hit the 
right search keywords. I stumbled upon Ruby on Rails, which (surprise, surprise) had the tagline of **"Convention over 
Configuration"**. I just knew then, this is exactly what I need.

The fact that you could just run 

```
rails generate scaffold Post title:string body:text
```

and it generates a fully-functional (albeit basic) blogging app, that's pure bliss. Here's 
[DHH](https://twitter.com/DHH) (Creator of Ruby on Rails) building and deploying a blog to production in a couple
minutes.

{{< rawhtml >}} 

<video width=100% controls>
    <source src="https://d1snj8sshb5u7m.cloudfront.net/Rails7.mp4" type="video/webm">
    Your browser does not support the video tag.  
</video>

{{< /rawhtml >}}

Learning Ruby on Rails really did kickstart my career in ways I would not have thought of, and I wouldn't have it any 
other way. 

You should check it for yourself at [their homepage](https://rubyonrails.org).

## Systems development

I built a lot of projects in the realm of web development -- chat apps, todo lists, blogging platforms, code judge 
platforms. But it was a lot of the same, sending requests back and forth to a web server, with a only slightly different 
flavor each time. I wanted to do something a few levels _deeper_.

**Something much closer to the metal.**

Well, what is closer to the metal than an operating system? I don't remember how but I found a tutorial for building
and operating system in Rust. What more could one ask for? So I went over to https://intermezzos.github.io/ and got 
cracking. It involved writing a bootloader in x86 Assembly, booting into "real mode", making the jump to "Long Mode" 
where the real work begins. The intermezzos tutorial seemed incomplete, but thankfully they mention that it's based on 
https://os.phil-opp.com, so I went over there and got into a lot more things:

Managing exceptions, double faults (exceptions while handling exceptions), dealing with hardware interrupts, managing
memory, allocating the heap,.... And it goes on.

It looked something like this:
![OS GIF](https://os.phil-opp.com/hardware-interrupts/qemu-hardware-timer-dots.gif)

**But this time it was exciting, not overwhelming.**

It seemed like a signal that I enjoy working on things that are adjacent, not necessarily the same to operating systems.
This was around the time that COVID hit, and yet again I found myself wanting to work on something interesting again.
I don't remember why but I decided to build my own programming language, HOW HARD COULD IT REALLY BE?!

![Tisp blog post](tisp.png)

I eventually found out, wrote a 
[blog post about it](https://dev.to/faraazahmad/i-was-bored-so-i-built-my-own-programming-language-30f1), and boy did it
do numbers.

This helped me narrow my interests in systems development, helped me find a job where I don't hate every second of it.
Helped me find like-minded people, people who were interested in the same things I was, people who helped me be a 
better engineer. 

I started speaking at technical conferences, local meetups. Met a lot of amazing people in the industry, and it 
snowballed from there.

## Epilogue

None of this is linear, there will be setbacks. Sometimes more setbacks than progress, but you gotta make sure the 
slope trends upwards, little by little.

People overestimate how much they can do in 6 months, and underestimate how much they can do in 6 years.

Expose yourself to different experiences. Work at a massive organization, join a startup, or start your own. 
Go to conferences, be a speaker, "fail" in front of everyone, what's the worst that could happen? Let it happen. You'll
come out better on the other side.

{{<twitter 1655237300933230593>}}

People with a wide range of experiences are more likely to do well in life, you don't have to specialize too soon. You
see it all and eventually make informed judgements on what you want to focus on. You don't need to be an expert on 
everything you do, but atleast make the effort to learn how deep the rabbit hole goes.


Trust me, you're gonna make it.

{{< youtube B6lBtiQZSho >}}
