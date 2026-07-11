---
title: "These are 2 Senior Staff Engineers at Airbnb. In just 15 minutes, they will teach you more about Agentic Coding than 100 YouTube video guides. Airbnb has already shipped one of the most ambitious… | Linas Beliūnas | 82 comments"
source_url: "https://www.linkedin.com/posts/linasbeliunas_these-are-2-senior-staff-engineers-at-airbnb-ugcPost-7481062194848227329-YH7Y/"
final_url: "https://www.linkedin.com/posts/linasbeliunas_these-are-2-senior-staff-engineers-at-airbnb-ugcPost-7481062194848227329-YH7Y/"
captured: "2026-07-10T11:14:36.445298-07:00"
captured_by: "Hermes Agentic-KB Scout manual run"
word_count: 3566
status: unprocessed
---

# These are 2 Senior Staff Engineers at Airbnb. In just 15 minutes, they will teach you more about Agentic Coding than 100 YouTube video guides. Airbnb has already shipped one of the most ambitious… | Linas Beliūnas | 82 comments

Source URL: https://www.linkedin.com/posts/linasbeliunas_these-are-2-senior-staff-engineers-at-airbnb-ugcPost-7481062194848227329-YH7Y/
Final URL: https://www.linkedin.com/posts/linasbeliunas_these-are-2-senior-staff-engineers-at-airbnb-ugcPost-7481062194848227329-YH7Y/
Content-Type: text/html; charset=utf-8
Source note: Apple Notes 2026-07-10: Airbnb agentic coding talk; extract navigator/driver model, multiple agentic sessions, routines, adoption framing.

## Extracted Source Text

These are 2 Senior Staff Engineers at Airbnb. In just 15 minutes, they will teach you more about Agentic Coding than 100 YouTube video guides.

Airbnb has already shipped one of the most ambitious… | Linas Beliūnas | 82 comments 

 Agree & Join LinkedIn

 By clicking Continue to join or sign in, you agree to LinkedIn’s User Agreement , Privacy Policy , and Cookie Policy .

 Skip to main content

 LinkedIn 

 Top Content

 People

 Learning

 Jobs

 Games

 Sign in

 Join now

 Linas Beliūnas

 23h

 Report this post

 These are 2 Senior Staff Engineers at Airbnb. In just 15 minutes, they will teach you more about Agentic Coding than 100 YouTube video guides.

Airbnb has already shipped one of the most ambitious LLM-agent migrations in production. 

In this video, they show how they actually build with agents in 2026.

Coupled with this Claude Code Routines guide, you will never use Claude AI the same again: https://lnkd.in/dfFmzpAe 

Pure signal. From the people who actually ship - not guess.

 …more

 2,800

 82 Comments

 Like

 Comment

 Share

 Copy 

 LinkedIn 

 Facebook 

 X 

 Transcript

 Transcript

 Transcript 

 But specifically Agentic coding and I'm Stepan joining with Mike. We are engineers at developer Latform at RBNB and we build tools for engineers and we integrate those amazing like AI technologies. Uh, and I've been building tools for engineers for close to two decades. I've done open source, maybe use some of that. And it's been, I'm amazed where there's like Gennai evolution is taking us. It's like, I've not seen such graphs of productivity so far, So it's amazing. So at the start of 2025, we said that vision, We told us that this is how we explained to our leadership where we headed. The way we like to do it, especially when we are tackling some big things, big step function changes, is we set up like a bold vision and then figure out how to work backwards from there. And this helps because, you know, if you only think about incremental improvements, it's kind of hard to make a big change. Now we thought that this vision is bold. Now it's probably normative, right? We've seen the progression of the models and the tooling, but that's how we've started earlier this year. And to put it into some like images, we started with those like, you know, old ways of developing engineers like typing letters and numbers and producing lines of code through what we've done a few years ago with copy pasting from charging BT and. Uh, you know, your copilot. All good tools, we still use them, but that's not where the magic happens. This is not this like paradigm shifting change where an agent can, sorry, when a developer, not an agent, we're human engineer can steer multiple agentic sessions and produce and materialized code changes, right? That's our direction. Uh, the way we've explained that to our leadership at start of 2025, we've used pair programming analogy for this. I have a bias for this. I like programming. I used to do a lot of that. I used to do programming like entire full day from 9:00 to 5:00 from Friday to from Monday to Friday, reprogramming all the way. I loved it. It formed me as an engineer. It's especially rewarding if you're pairing with something with an expert because you learn so much. But at the same time, the classic pair programming has also disadvantages, right? Sometimes you it will slow when you're making like a small changes, bug fixes. Sometimes it's also taxing, it's tiring if you're like, you know, pairing entire day and in classic pair programming, you have a driver and engineer who takes the role of like holding the keyboard and like being tactical and navigator who is strategic, who's going to see, you know, that the forest, not just one tree, right? So using that analogy, agent decoding is where a developer becomes this permanent navigator and it's it's steering that agentic session. That in an agent or your tool is materializing code changes. That's where we headed. I think we're going to stick to that analogy this year, like in the future. I don't know if we're going to stick, especially if you parallelize and you have many of those agents, but that's how we wrapped our heads around that like at the start of 2025. And we also gave some predictions to our leadership. And we were sandbagging them a bit too much I think because we were not ambitious enough. I guess with those we thought that like at the end of 2025 like materializing code changes through an agentic session, it's going to be maybe at like, you know, 20 to 40% of like your peers or engineers that are using it on a daily basis. So I'm showing you those predictions, but they are not very accurate because we are like right, right now we are like 16 few percent. So it's going faster and it's amazing. It's interesting. Now those are predictions and they are useful, especially if you're explaining your vision to your leadership, to your to your workforce. But those are not chaos. Those are not how we measure success. And that's to measure the success, you need to apply a different methodology. What works that they're BNB is we try to get this holistic view of developer productivity, things that like Vic was talking in his like keynote. So we look at developer sentiments, we look at the tool usage and adoption, and we also look at the objective metrics from your engineering system. You can look at R velocity and number of other metrics, right? To give you a glimpse of what the data is showing as like today and currently. So when we look at developer sentiments, they tell us the AI is amazing. This is the best thing ever. Like give me more. So last four surveys, that was like the top. Voted Engineering Productivity improving tool. Another prediction for the next 6 survey is going to be the same. They're gonna keep telling us this is the best thing ever, right? We also look at the adoption of those like AI tools and specifically showing you the adoption curve of agentic coding. And it amazes me. And so I'm showing 2 curves. 1 is some of the tooling that we built that wasn't agentic was like IDE plugins that aid engineers through this journey, but not yet agentic only around like 6-7 months ago. Like we've started like going farther into agentic coding, certain models improve, certain tools emerged. On the market or in open source. So it was made possible for us. And this is where we see this almost vertical line of like adoption, very eager adoption. And I've not seen that ever like building tools for engineers for close to 20 years for like such a graph, like such a like eager adoption. And we don't force engineers to use it. It's a supplemental tool. You can use it to augment your engineering, your developer, but you don't have to. We don't force you. We do all kinds of things to encourage to go on the road, so to explain to like. Each we also see try to integrate it as seamlessly as possible so that you are, you know, one click away from an from starting an agentic session. So those are the things you can do, but it's amazing how the engineering communities adopting this. Also we look at the outputs of the engineering system and they're like number of caveats with that O and this is just one of the metrics you can look at. We don't use it as a measure of like personal productivity. It is we look at aggregate. We want to understand if those AI tools have an effect on certain objective metrics that we can view our engineering system. So that's our velocity and I have a couple of curves here. 1 is on a I added tools and also something that started six to seven months ago like Agenti coding. And we can see that, that there is correlation of some metrics of the engineering system, the PR velocity. And adoption and leveraging those tools by our engineers. OK, so we talked about Argentine coding. Let's define it. We often talk about like inner developer loop. So we have our developer loop. At some point from that developer loop, an engineer would spec or prompt and we'll start the agentic loop. And agentic loop is a loop because it is, it can calms multiple times, it can call different tools, your MCPS multiple times, It will leverage guardrails, it will load the config. By config, I mean you know your internal configuration like system prompt, but also things like you know your agents MD claud MD, your cursor. Rules. Those are also like configurations. And I guess the key thing that I want to, I want you to take away from it is that like an engineer who's like leveraging agentic tool. Like you don't know how many, how you start your agentic session, but you don't know exactly how, what are the prompts that the agentic tool will use when it calls LLNS? You don't know exactly how many times it's going to call. You don't know exactly what tools is going to use it. It can run builds or tests or access your internal knowledge. It has this level of let's code autonomy. OK, so that's why it's agenting. That's why we think about it as a loop. At the end of that, there is output from that loop. Technically, those are code changes that a human has to review. OK, and I'll get to this is important. It must be reviewed by a human engineer before it's before the R is submitted. OK, Umm, we also like to think about this Argenti coding through, you know, what is the model of learning and acquiring skill and agentic coding. It is useful because it helps us shape that it helps us understand maybe some engineers are going too fast or too slow on that on that journey. So that that helps us make certain changes and work with our engineering community at Airbnb just to go quickly through this. We've all started with our first steps and I think. The VCR familiar with like level 2 using your agentic tool. And initially when I remember using a agentic tool, I would. Approve every operation it does and that's fine. I learned I got better at prompting. I got better at contextualizing. At some point I leveled U to where I feel more comfortable putting my tool on auto approve. You just keep going keep going show me the diff OK now I wouldn't say that I trust the AI. That's not I would say that I trust my skill and prompting in like use in using the tools so that I get value out of it without like approving every operation. OK, but it takes time it's a journey. OK. And finally at level 4, this is like Mike, this is me. We're building, we're integrating those tools. We are making the transformation of the workforce at your workplace and some of you probably are working in your dev infra teams. Building MCPS, integrating those tools, contributing to open source, that's beautiful. Ah OK, I I guess the point I'm trying to make, humans are still needed. They need to review the outputs from the AI before the R is submitted for another human to review. And I think that you want to give time to engineers to to adopt and they will have different pace in like acquiring this skill and like getting to like really high proficiency. Getting too fast to putting your tool on auto proof is not great it. What happens is an engineer may create very large hours that they don't review fully, don't act they don't actually understand, and review every single line of code to fully understand. They don't. They may not like review test code as eagerly as the production code, is what I'm keep telling at conferences. Like, you know, keep make sure your test code is of high quality as as much as your production code. Refactor your test. Keep them clean and maintainable. Another thing like to me, what's also important in understanding those changes that are coming from your agentic tool is like pushing back on the tool like you don't trust it like if something feels suspicious because I don't think that it works this way, why you ask it right? Like why did you do this in line 120, right? And then your agentic tool will be very confident and will explain you why, right But after a couple of rounds and again, no, but like tell me why you know you, you get to this very satisfying moment where the agentic. Still gives up. Oh yeah, you're right. OK, I'm sorry. I was wrong. Let's fix it. Right. So that's that's like, really important. Yeah. And I think that. This at some point we are able to parallelize those workloads. OK. And I remember like my journey. So I would first when I was able to when I felt confident to put my tool on auto approve yeah, I didn't actually start another coding task, right. I would review the design dogs. I would create a design dock on the side. But at some point I got more confident and I would have like multiple of those workspaces. Each workspace would have a genetic session it will be doing certain. Coloring task for me. There are some power users that are bomb that will have like 5 parallel workspaces at the same time, each building another. And another technical like prototype of some sort like Pandemonium a little bit, right, like as the as in the keynote. But this is where the magic happens and we can multiply productivity. So we'll see what the maybe we're the future engineer will not be good at flow. It's going to just be very good at context switching. That's going to be the main thing we need to learn, right? One of the things that has worked for us really well is we built tech at Airbnb that helps us have those sandboxed. Environments Workspaces. It's called Archive Workspace. We resented this a few years ago at this conference, so there's a YouTube video on this. Because look, if you're parallelizing those agentic sessions. I mean there's a way to do it on your laptop, on one machine that like you can use git work trees. There are ways to do it. There are some open source tech that you can use. But we don't recommend it. I think that like when you can have sandboxed environments like, you know, separate machines in the cloud. That is going to be much better, is going to be more consistent, more reliable and we were. We're happy that we can leverage that other BNB. Glad because we built some tech for that and I think what my one take away that I want I want you to take from it is that like you're agentic tool is not enough. You will have to have a lot of tech around it. Like you need to have a tech for for your remote IDs for your sandbox environments and you need to have a really good code review tools and culture around that because you know who knows maybe software engineering of the future is like all of it's it's all code review, right? That's all we do right I'm OK with that so. Yeah, and I think that was my last slide. I'm going to give you Mike now, and Mike will go deeper on things, I promise. Right. Go take it from here. Hey, folks. Wow, what an opening. So one before we get to my actual slides, I just want to say I can't believe any of this works. I can't believe that any of this made it easier. But AI allows people like me. I'm a college dropout. I did Android for 10 years. I've recently switched to dev platform. It allows me to keep up with people like Japan. That's been, like you said, doing this for 20 years and running circles around me previously. So game on. I'm keeping up now. So first I want to echo something that my VP said. We need to meet developers where they are. It's hard enough for all of us to learn Agenta, coding and AI. It's even more difficult if someone tells you, hey, you have to do it this way in this new tool and really just, you know, kick your legs out from under you. So in Q12025I think this is one that big change happened. We all were learning a new way to code, coding agents started to appear in CLI and Ides, and this was industry wide. It didn't matter if you're a infra engineer, front end, back end, maybe you were not even an engineer, but this really.

 Linas Beliūnas

 13h

 Report this comment

 By the way, in case you missed it, also check out The Complete Claude /goal Guide for AI Agents (that turns Claude into your 24/7 AI employee)🤖: https://linas.substack.com/p/the-complete-claude-goal-guide 

 No more previous content

 No more next content

 Like

 Reply

 10 Reactions

 11 Reactions

 Ares Yeghiyayan

 22h

 Report this comment

 Agentic coding gets interesting only when it moves from demos to production constraints.
The real skill is not prompting harder.
It is knowing what to delegate, what to review, and what to never let the agent touch blindly.

 Like

 Reply

 26 Reactions

 27 Reactions

 Matthew C.

 22h

 Report this comment

 Anyone have the real source for this?

 Like

 Reply

 6 Reactions

 7 Reactions

 Chris Polczer

 22h

 Report this comment

 “Ship, not guess” is becoming one of the defining principles of the AI era. Experience creates patterns. Patterns become judgment. That’s much harder to copy than prompts.

 Like

 Reply

 5 Reactions

 6 Reactions

 Robert Haase

 21h

 Report this comment

 Lars Krüger Tabea Lilli Brandenburger Frank Martin Dietrich 

 Like

 Reply

 5 Reactions

 6 Reactions

 Muhammad Atif

 21h

 Report this comment

 Linas Beliūnas Exploring real-world agent integration like this sparks ideas for more scalable AI solutions.

 Like

 Reply

 4 Reactions

 5 Reactions

 Adebayo Alomaja ( BayoGPT )

 22h

 Report this comment

 Nice stuff

 Like

 Reply

 2 Reactions

 3 Reactions

 Chetna Tanwani

 20h

 Report this comment

 Thank you for sharing Linas Beliūnas 

 Like

 Reply

 3 Reactions

 4 Reactions

 Norbert PALFALVI

 22h

 Report this comment

 +

 Like

 Reply

 1 Reaction

 2 Reactions

 Albert Campillo

 22h

 Report this comment

 🔥🔥🔥 stuff Linas Beliūnas 

 Like

 Reply

 1 Reaction

 2 Reactions

 See more comments

 To view or add a comment, sign in 

 663,101 followers

 3000+ Posts

 1,040 Articles

 View Profile

 Follow 

 More from this author

 Meta wants to clone Polymarket & Kalshi, but it can’t clone regulatory moat 🤷; Santander open-sourced its entire AI governance stack 🤖

 Linas Beliūnas

 1d

 Santander just open-sourced its entire AI governance stack.🤖🏦; Revolut’s $115B secondary share sale mints Europe’s first centicorn 🇪🇺🦄

 Linas Beliūnas

 3d

 Plaid’s AI now sees what no single bank can 👀🏦; Santander just open-sourced its AI governance stack. No other major bank has 🤖🏦

 Linas Beliūnas

 5d

 Explore content categories

 Career 

 Productivity 

 Finance 

 Soft Skills & Emotional Intelligence 

 Project Management 

 Education 

 Technology 

 Leadership 

 Ecommerce 

 User Experience 

 Show more

 Show less

 LinkedIn 
 
 © 2026 

 About

 Accessibility

 User Agreement

 Privacy Policy

 Your California Privacy Choices

 Cookie Policy

 Copyright Policy

 Brand Policy

 Guest Controls

 Community Guidelines

 العربية (Arabic)

 বাংলা (Bangla)

 Čeština (Czech)

 Dansk (Danish)

 Deutsch (German)

 Ελληνικά (Greek)

 English (English) 

 Español (Spanish)

 فارسی (Persian)

 Suomi (Finnish)

 Français (French)

 हिंदी (Hindi)

 Magyar (Hungarian)

 Bahasa Indonesia (Indonesian)

 Italiano (Italian)

 עברית (Hebrew)

 日本語 (Japanese)

 한국어 (Korean)

 मराठी (Marathi)

 Bahasa Malaysia (Malay)

 Nederlands (Dutch)

 Norsk (Norwegian)

 ਪੰਜਾਬੀ (Punjabi)

 Polski (Polish)

 Português (Portuguese)

 Română (Romanian)

 Русский (Russian)

 Svenska (Swedish)

 తెలుగు (Telugu)

 ภาษาไทย (Thai)

 Tagalog (Tagalog)

 Türkçe (Turkish)

 Українська (Ukrainian)

 Tiếng Việt (Vietnamese)

 简体中文 (Chinese (Simplified))

 正體中文 (Chinese (Traditional))

 Language

 Sign in to view more content

 Create your free account or sign in to continue your search 

 Email or phone

 Password

 Show 

 Forgot password? 

 Sign in

 Sign in with Email 

 or

 New to LinkedIn? Join now 

 By clicking Continue to join or sign in, you agree to LinkedIn’s User Agreement , Privacy Policy , and Cookie Policy .
