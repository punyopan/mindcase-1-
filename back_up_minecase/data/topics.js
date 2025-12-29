export const topics = [
     {
      id: 1,
      name: "School Mysteries",
      icon: "🏫",
      color: "from-blue-700 to-indigo-900",
      borderColor: "border-blue-500",
      description: "Investigate educational scenarios",
      unlocked: true,
      puzzles: [
        {
          id: 1,
          title: "The Missing Money",
          icon: "💰",
          skillFocus: "Logical Reasoning",
          skillType: "logical",
          color: "from-amber-600 to-amber-800",
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop",
          question: "School fundraiser money ($500) is missing. Timeline: 3pm - money confirmed in office, 3:15pm - Teacher A left building, 4pm - Janitor B cleaned office, 5pm - Principal C locked up, 5:15pm - money discovered missing. Everyone is panicking and your colleague wants to interrogate all three suspects immediately.\n\nWhat should you investigate FIRST and why?",
          idealAnswer: "First, check if theft actually happened before blaming anyone. Was the money really there at 3pm? Who else could access the office? Could it have been moved for a legitimate reason? This matters because jumping to conclusions wastes time interrogating innocent people while the real answer might be simple. Many 'mysteries' dissolve when we verify basic facts first.",
          keyPrinciples: ["Question assumptions before investigating", "Validate the premise/starting conditions", "Consider alternative explanations", "Don't jump to conclusions about suspects"]
        },
        {
          id: 2,
          title: "The Identical Essays",
          icon: "📝",
          skillFocus: "Decision Making",
          skillType: "decision",
          color: "from-red-600 to-red-800",
          image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop",
          question: "Two students submitted word-for-word identical essays. Your colleague is furious and wants to fail both immediately - 'Clear evidence of cheating!' You have 24 hours before grades are due. Both students have clean records.\n\nHow would you approach this decision?",
          idealAnswer: "Don't rush this decision. First, talk to both students separately. Check who submitted first. Search online - maybe both copied from the same website. They might have studied together legitimately. This is important because failing students destroys their academic future, so we need to know what actually happened. Could be plagiarism, could be collaboration, could be a shared source. Investigate before punishing.",
          keyPrinciples: ["Avoid hasty decisions under pressure", "Gather evidence before acting", "Consider multiple explanations", "Recognize irreversible consequences need higher evidence standards"]
        },
        {
          id: 3,
          title: "The Back Row Pattern",
          icon: "📊",
          skillFocus: "Adaptive Learning",
          skillType: "adaptive",
          color: "from-purple-600 to-purple-800",
          image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=200&fit=crop",
          question: "You notice students who sit in the back consistently score 15% lower on average. A veteran teacher declares: 'This proves back-seaters are lazy and unmotivated. We should assign seats.'\n\nWhat's wrong with this conclusion?",
          idealAnswer: "This conclusion is wrong because correlation doesn't mean causation. Maybe struggling students choose back seats to hide, not the other way around. Or maybe students with vision problems sit far back AND can't see the board. The teacher sees a pattern and assumes seating causes bad grades, but it could be reversed or explained by other factors. To actually prove seating matters, you'd need to randomly assign seats and compare results.",
          keyPrinciples: ["Correlation does not equal causation", "Consider reverse causation", "Look for third variables/confounders", "Recognize the same logical pattern across different contexts"]
        },
        {
          id: 4,
          title: "The Budget Crisis",
          icon: "💸",
          skillFocus: "Decision Making",
          skillType: "decision",
          color: "from-green-600 to-green-800",
          image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=200&fit=crop",
          question: "School must cut $50,000 from budget by Friday. You have three options with incomplete data: Option A saves $50k but affects 200 students' programs, Option B saves $40k affecting only 50 students, Option C saves $50k but impact data is 'still being compiled.' The superintendent is pressuring for a decision TODAY.\n\nHow should you handle this?",
          idealAnswer: "Push back on this rushed deadline. We need complete data on Option C before deciding anything. The problem is that missing information could show Option C is best - or worst. We don't know because the data isn't ready. Waiting two days for critical information is better than making a permanent mistake that affects hundreds of students. When decisions can't be reversed and stakes are high, demand the full picture first.",
          keyPrinciples: ["Artificial deadlines don't justify incomplete analysis", "Irreversible decisions need higher evidence standards", "Missing information could change the optimal choice", "Push back on pressure when stakes are high"]
        },
        {
          id: 5,
          title: "The Wonder Method",
          icon: "🎓",
          skillFocus: "Source Evaluation",
          skillType: "source",
          color: "from-indigo-600 to-indigo-800",
          image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop",
          question: "A vendor presents 'Method X' showing 20% improvement in test scores. Your principal is excited and wants school-wide adoption. But you notice: it was tested only on honors students, lasted just 2 weeks, and compared results to the OLD curriculum (not your current one).\n\nWhat are the problems with this evidence?",
          idealAnswer: "This evidence has major problems. First, they only tested honors students - results won't apply to average students. Second, two weeks is too short to show if it actually works long-term. Third, they compared it to the OLD curriculum, not our current one. So we don't even know if it's better than what we're already doing. These flaws make the evidence useless for deciding whether to adopt school-wide.",
          keyPrinciples: ["Identify multiple flaws in research", "Representative samples matter", "Short timeframes show novelty effects not lasting impact", "Comparison groups must be appropriate"]
        }
      ]
    },
    {
      id: 2,
      name: "Digital Deception",
      icon: "📱",
      color: "from-pink-700 to-rose-900",
      borderColor: "border-pink-500",
      description: "Analyze online information",
      unlocked: true,
      puzzles: [
        {
          id: 6,
          title: "The Viral Statistic",
          icon: "📈",
          skillFocus: "Source Evaluation",
          skillType: "source",
          color: "from-cyan-600 to-cyan-800",
          image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop",
          question: "'90% of students using AI tools score lower on creativity tests' - This post has 50,000 shares, an anonymous author, and no link to any study. Your school board member wants to ban AI tools based on this.\n\nWhat's wrong with using this as evidence for policy?",
          idealAnswer: "This is terrible evidence for policy. No source means we can't verify if the study even exists. Anonymous authormeans no one is accountable. 50,000 shares doesn't make it true - it just means it spread. Even if a study exists, we don't know how they measured 'creativity' or if struggling students just use AI more. Banning tools based on unverified social media posts is wrong because policies need real evidence, not viral claims.",
          keyPrinciples: ["Viral spread doesn't indicate truth", "No source means no verification possible", "Anonymous claims lack accountability", "Distinguish correlation from causation even in cited statistics"]
        },
        {
          id: 7,
          title: "The Principal Video",
          icon: "🎭",
          skillFocus: "Bias Detection",
          skillType: "bias",
          color: "from-red-600 to-red-800",
          image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=200&fit=crop",
          question: "A video surfaces showing your school principal making extremely controversial statements. It's spreading rapidly on social media. Students are organizing protests. Parents are calling the school. You have 2 hours before an emergency board meeting.\n\nWhat should be your priority?",
          idealAnswer: "Verify first, act later. Contact the principal directly - is it real or fake? Check where the video first appeared. Look for editing signs or deepfake artifacts. Find the full context - maybe it's clipped to mislead. This matters because acting on a fake video destroys someone's reputation permanently. Two hours is enough to do basic checks. When stakes are this high, verification is MORE important, not less.",
          keyPrinciples: ["Verify before acting, especially under pressure", "High stakes require more verification, not less", "Deepfakes and manipulated media exist", "Direct confirmation from source is essential"]
        },
        {
          id: 8,
          title: "The Expert Influencer",
          icon: "⭐",
          skillFocus: "Source Evaluation",
          skillType: "source",
          color: "from-purple-600 to-purple-800",
          image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=200&fit=crop",
          question: "A verified education influencer with 500,000 followers enthusiastically recommends a new learning technique. They have a blue checkmark, professional-looking videos, and thousands of positive comments.\n\nHow should you evaluate whether to implement their recommendation?",
          idealAnswer: "Blue checkmark just means verified identity, not expertise. 500k followers means popular, not correct. First, check their actual credentials - are they qualified? Look for real research backing their claims. Search for critics, not just fans. Test it small before adopting school-wide. The problem is confusing popularity with expertise - just because many people follow someone doesn't mean they're right about education.",
          keyPrinciples: ["Verification badges confirm identity not expertise", "Popularity doesn't equal correctness", "Check actual credentials and evidence", "Test small before adopting fully"]
        },
        {
          id: 9,
          title: "The Comment Consensus",
          icon: "💬",
          skillFocus: "Bias Detection",
          skillType: "bias",
          color: "from-green-600 to-green-800",
          image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop",
          question: "A post about your school's homework policy has 200 comments. 180 comments (90%) say 'Homework is harmful and should be banned!' A parent presents this at a board meeting as 'overwhelming community consensus.'\n\nIs this actually evidence of community consensus?",
          idealAnswer: "No, this is selection bias. Angry people are way more likely to comment - satisfied parents just scroll past. This is like asking only people at a complaint desk if they're happy. The 70% who didn't comment aren't represented. The problem is that comment sections only show opinions from people motivated to speak up, usually negative. Real consensus needs surveys sent to everyone randomly, not just whoever chooses to comment.",
          keyPrinciples: ["Comment sections are self-selected, not representative", "People with strong opinions are more likely to engage", "Silent majority may feel differently", "True consensus requires random/representative sampling"]
        },
        {
          id: 10,
          title: "The Algorithm Echo",
          icon: "🔄",
          skillFocus: "Bias Detection",
          skillType: "bias",
          color: "from-orange-600 to-orange-800",
          image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=200&fit=crop",
          question: "You're researching 'Method X' for your school. Your social media feed shows 10 articles all praising it as 'revolutionary.' You can't find any criticism anywhere you look. You're about to propose school-wide adoption.\n\nWhat's the hidden risk here?",
          idealAnswer: "This is an algorithm filter bubble. The system shows me more of what I've clicked, creating fake consensus. Just because MY feed agrees doesn't mean experts agree. The problem is the algorithm hides criticism from me. I should search specifically for 'Method X problems', 'Method X failed', or 'Method X criticism'. Check different platforms or incognito mode. The absence of negative content in my feed doesn't mean it doesn't exist - it means it's being filtered out.",
          keyPrinciples: ["Algorithms create echo chambers by design", "Actively search for disconfirming evidence", "Use critical search terms to find opposing views", "Your feed's agreement doesn't equal actual consensus"]
        }
      ]
    },
    {
      id: 3,
      name: "Workplace Whodunit",
      icon: "💼",
      color: "from-slate-700 to-slate-900",
      borderColor: "border-slate-500",
      description: "Navigate professional puzzles",
      unlocked: true,
      puzzles: [
        {
          id: 11,
          title: "The Remote Work Blame",
          icon: "👥",
          skillFocus: "Logical Reasoning",
          skillType: "logical",
          color: "from-blue-600 to-blue-800",
          image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=200&fit=crop",
          question: "Team A (fully remote) consistently misses deadlines. Team B (in-office) consistently meets them. Your manager concludes: 'Remote work causes poor performance. Everyone back to office.'\n\nWhat's missing from this analysis?",
          idealAnswer: "This ignores confounding variables. Many factors could explain the difference: Team A might have harder projects, less experienced members, worse management, fewer resources, more demanding clients, or different workload. The correlation (remote + delays) doesn't prove remote work CAUSES the delays. To actually test remote work's effect, you'd need the SAME team doing SIMILAR work in both conditions, controlling for other factors. Making everyone return to office won't fix the real issues if remote work isn't actually the cause.",
          keyPrinciples: ["Identify confounding variables", "Correlation doesn't prove causation", "Need to isolate the variable being tested", "Policy based on flawed analysis won't fix real problems"]
        },
        {
          id: 12,
          title: "The Promotion Puzzle",
          icon: "📈",
          skillFocus: "Decision Making",
          skillType: "decision",
          color: "from-green-600 to-green-800",
          image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=200&fit=crop",
          question: "Two candidates for a critical promotion. Candidate A: outstanding metrics, but you heard 'concerning gossip' from a colleague. Candidate B: decent metrics, extremely likable, everyone's friend. Decision due tomorrow.\n\nHow should you approach this decision?",
          idealAnswer: "I should not let gossip or likability drive this career-altering decision. Steps: 1) Verify the gossip - who said what specifically? Is there documentation? What do A's direct reports and clients actually say? 2) Pull objective performance data for both candidates. 3) Conduct structured interviews with consistent questions. Gossip is hearsay, not evidence. Likability creates bias (halo effect). One day's delay to gather facts is worth it for a decision affecting someone's career. Promotions require evidence standards, not popularity contests or rumors.",
          keyPrinciples: ["Gossip is hearsay, not evidence", "Likability creates halo effect bias", "Career decisions need evidence standards", "Delay to verify is worth it for irreversible decisions"]
        },
        {
          id: 13,
          title: "The Meeting Paradox",
          icon: "⏰",
          skillFocus: "Adaptive Learning",
          skillType: "adaptive",
          color: "from-purple-600 to-purple-800",
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=200&fit=crop",
          question: "You analyze company data and find: weeks with more meetings correlate with lower team productivity. Your CEO wants to mandate 'meeting-free weeks' to boost productivity.\n\nWhat's the flaw in this reasoning?",
          idealAnswer: "This is reverse causation. When projects face problems and struggle, teams call MORE meetings to troubleshoot and coordinate. The meetings are a RESPONSE to low productivity, not the CAUSE. It's like observing that hospitals have more sick people and concluding hospitals cause illness. If you ban meetings, the underlying problems remain - you've just removed a troubleshooting tool. The right question is: what's causing projects to struggle in the first place? Address root causes, not symptoms.",
          keyPrinciples: ["Consider reverse causation", "Correlation can flow either direction", "Symptoms vs root causes", "Removing the response doesn't fix the underlying problem"]
        },
        {
          id: 14,
          title: "The AI Vendor Pitch",
          icon: "🤖",
          skillFocus: "Source Evaluation",
          skillType: "source",
          color: "from-red-600 to-red-800",
          image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=200&fit=crop",
          question: "A vendor demonstrates their AI tool, claiming it 'increased productivity 40% at Company X.' The demo is slick and impressive. They're offering a 'limited time' discount if you sign this week. They want your decision by Friday.\n\nWhat should make you skeptical?",
          idealAnswer: "Multiple red flags: 1) Cherry-picked success story - why only Company X? What about failures? 2) No timeframe mentioned - novelty effect? 3) No control group - compared to what baseline? 4) 'Limited time' is a pressure tactic to prevent due diligence. 5) Demos are controlled theater, not real-world conditions. I would: ask for 5+ references I can contact independently, look for peer-reviewed studies, request a trial period before commitment. Sales pressure + impressive claims = maximum skepticism needed.",
          keyPrinciples: ["Recognize cherry-picked success stories", "Time pressure is a sales tactic", "Demos don't reflect real-world performance", "Demand independent verification and references"]
        },
        {
          id: 15,
          title: "The Survey Trap",
          icon: "📊",
          skillFocus: "Bias Detection",
          skillType: "bias",
          color: "from-amber-600 to-amber-800",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
          question: "Employee satisfaction survey results: 60% report being unhappy with leadership. HR recommends immediate leadership changes. The survey had a 30% response rate.\n\nWhat critical question should you ask before acting?",
          idealAnswer: "The key question: what about the 70% who didn't respond? This is non-response bias. Unhappy employees are more motivated to voice complaints in surveys. Satisfied employees often think 'everything's fine, why bother?' and don't respond. The silent 70% might feel very differently. Before major changes: 1) Why was response rate so low? 2) Can we reach non-responders through different methods? 3) What do exit interviews from people who left satisfied show? 4) Are the 30% who responded representative? Making organizational changes based on a potentially biased 30% is risky.",
          keyPrinciples: ["Non-response bias skews results", "Unhappy people more likely to respond", "Low response rates make data unrepresentative", "Consider who ISN'T represented in the data"]
        }
      ]
    },
    {
      id: 4,
      name: "Health & Headlines",
      icon: "🔬",
      color: "from-emerald-700 to-teal-900",
      borderColor: "border-emerald-500",
      description: "Evaluate health claims critically",
      unlocked: true,
      puzzles: [
        {
          id: 16,
          title: "The Miracle Supplement",
          icon: "💊",
          skillFocus: "Source Evaluation",
          skillType: "source",
          color: "from-green-600 to-green-800",
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=200&fit=crop",
          question: "A headline reads: 'New Study Shows Supplement X Doubles Memory!' The study: 20 participants, 4 weeks long, funded by the supplement manufacturer, no placebo control group. Your friend wants to spend $200/month on it.\n\nWhat would you tell them about this evidence?",
          idealAnswer: "I'd point out the stacked red flags: 1) 20 participants is far too few for reliable results - random variation dominates. 2) 4 weeks can't show lasting effects or long-term safety. 3) Manufacturer funding creates publication bias - negative results get buried. 4) No placebo means expectation effects aren't controlled - people often improve just believing they're taking something. Each flaw alone is concerning. Together? This study tells us almost nothing. Wait for large, independent, placebo-controlled, long-term trials before spending money.",
          keyPrinciples: ["Small sample sizes are unreliable", "Short timeframes miss long-term effects", "Funding source creates bias", "Placebo controls are essential"]
        },
        {
          id: 17,
          title: "The Diet Debate",
          icon: "🥗",
          skillFocus: "Adaptive Learning",
          skillType: "adaptive",
          color: "from-orange-600 to-orange-800",
          image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop",
          question: "Study A (500 participants): 'Low-carb diets reduce heart disease.' Study B (500 participants): 'Low-carb diets increase heart disease.' Both in respected journals. A health influencer says 'science is useless - just eat what feels right.'\n\nHow should you interpret these contradictory findings?",
          idealAnswer: "Contradictory findings aren't science failing - they're science WORKING by revealing complexity. I'd look deeper: What populations were studied? (Study A might be athletes, Study B diabetics). What timeframes? How was 'low-carb' defined? (Could mean different things). How was 'heart disease' measured? These contradictions often mean 'it depends on specific circumstances' - which is valuable information. The influencer's conclusion that science is useless is wrong. The real lesson is that nutrition is complex and context-dependent.",
          keyPrinciples: ["Contradictory studies reveal complexity, not failure", "Dig into methodology differences", "Results often depend on specific populations and conditions", "Science is a process of refinement, not absolute answers"]
        },
        {
          id: 18,
          title: "The Breakfast Study",
          icon: "📉",
          skillFocus: "Logical Reasoning",
          skillType: "logical",
          color: "from-blue-600 to-blue-800",
          image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=200&fit=crop",
          question: "A viral article claims: 'People who eat breakfast live 5 years longer!' It's based on a large observational study of 100,000 people. Your coworker, who skips breakfast, is now worried.\n\nWhat should you explain to them?",
          idealAnswer: "This is the classic correlation trap. Observational studies show correlation, not causation. Breakfast eaters might also: exercise more, smoke less, have better healthcare access, be wealthier, less stressed, more health-conscious overall. The study doesn't prove BREAKFAST causes longer life - it might just be a marker for a healthier lifestyle package. To prove causation, you'd need a randomized trial assigning breakfast vs. no breakfast randomly and controlling for other factors. Your coworker shouldn't panic based on observational correlation.",
          keyPrinciples: ["Observational studies show correlation, not causation", "Many healthy behaviors cluster together", "Need randomized controlled trials for causal claims", "Large sample size doesn't fix the correlation problem"]
        },
        {
          id: 19,
          title: "The Success Stories",
          icon: "🗣️",
          skillFocus: "Bias Detection",
          skillType: "bias",
          color: "from-purple-600 to-purple-800",
          image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop",
          question: "A treatment has been shown in large trials to work 30% of the time. Your online community has 50 people sharing dramatic success stories. Someone says 'Real experiences matter more than cold statistics.'\n\nHow do you think about this apparent contradiction?",
          idealAnswer: "This is survivorship bias. If 100 people try the treatment: 30 succeed and might post enthusiastically sharing their stories. 70 fail and move on silently - embarrassed, disappointed, or trying other things. Online communities self-select for success stories. The 'cold statistic' of 30% actually INCLUDES everyone - successes AND failures. The 50 anecdotes only represent the 30% who had good outcomes. Real experiences are valuable but are selected, not representative. Both perspectives have value, but statistics capture the full picture.",
          keyPrinciples: ["People who fail don't share stories", "Online communities select for success", "Statistics include everyone, anecdotes are selected", "Both qualitative and quantitative data have roles"]
        },
        {
          id: 20,
          title: "The Natural Label",
          icon: "🌿",
          skillFocus: "Logical Reasoning",
          skillType: "logical",
          color: "from-lime-600 to-lime-800",
          image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop",
          question: "A product advertises: 'All-natural ingredients - because natural is always safer than synthetic chemicals!' Your parent wants to switch all household products to 'natural' alternatives based on this principle.\n\nWhat's the flaw in this reasoning?",
          idealAnswer: "This is the appeal to nature fallacy. 'Natural' tells you nothing about safety. Arsenic, poison ivy, snake venom, mercury, botulinum toxin - all natural, all dangerous. Meanwhile, many synthetic medications save millions of lives. Safety depends on the specific properties of the substance, not its origin. 'Natural' is a marketing term, not a safety standard. I'd advise evaluating specific ingredients' actual properties and research, not labels. The feeling of 'natural' being safer is emotionally compelling but logically flawed.",
          keyPrinciples: ["Appeal to nature fallacy", "Natural substances can be harmful", "Synthetic substances can be safe and beneficial", "Evaluate specific properties, not origin labels"]
        }
      ]
    },
    {
      id: 5,
      name: "Money Mysteries",
      icon: "💰",
      color: "from-amber-700 to-yellow-900",
      borderColor: "border-amber-500",
      description: "Financial decision reasoning",
      unlocked: true,
      puzzles: [
        {
          id: 21,
          title: "The Hot Stock Tip",
          icon: "📈",
          skillFocus: "Bias Detection",
          skillType: "bias",
          color: "from-green-600 to-green-800",
          image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
          question: "Your coworker brags about tripling their money on a stock pick from a YouTube channel. 'This guy's picks always go up!' The channel shows a history of 10 winning predictions in a row.\n\nShould you follow the next tip?",
          idealAnswer: "No - this is survivorship bias. If thousands of people make random predictions, purely by chance some will have impressive streaks. The failed predictors quit, delete their channels, or get ignored. You only SEE the survivors. Key questions: What's the FULL track record including failures? How does it compare to just investing in an index fund? What about predictions that weren't shown? One person's success might be luck, not skill. Even 10 right predictions could be chance with enough predictors. Don't confuse surviving luck with genuine ability.",
          keyPrinciples: ["You only see successful predictors (survivors)", "Random chance creates impressive-looking streaks", "Ask about the full track record including failures", "Past success doesn't guarantee future performance"]
        },
        {
          id: 22,
          title: "The Course Dilemma",
          icon: "🎰",
          skillFocus: "Decision Making",
          skillType: "decision",
          color: "from-red-600 to-red-800",
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
          question: "You bought a $500 course that you've completed 80% of, but you're realizing it's not useful for your career goals. A better, free course just became available. Your thinking: 'I already spent $500, I should finish what I started.'\n\nIs this good reasoning?",
          idealAnswer: "No - this is the sunk cost fallacy. The $500 is gone regardless of what you do now - it's spent whether you finish or not. The only relevant question is: what's the best use of your FUTURE time? If the free course is better for your goals, every additional hour on the worse course is a NEW cost (opportunity cost of time). Past investments shouldn't trap you into future bad decisions. The 'I should finish what I started' instinct is understandable but leads to throwing good time after bad money.",
          keyPrinciples: ["Sunk costs are gone regardless of future choices", "Only future costs and benefits are relevant", "Past investments shouldn't dictate future decisions", "Opportunity cost of continuing matters"]
        },
        {
          id: 23,
          title: "The Car Deal",
          icon: "🏷️",
          skillFocus: "Bias Detection",
          skillType: "bias",
          color: "from-purple-600 to-purple-800",
          image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=200&fit=crop",
          question: "A car is listed at $40,000. The dealer offers to 'cut' it to $32,000 - an $8,000 discount! You feel like you're getting an amazing deal. Your friend says you're being manipulated.\n\nWhat's happening psychologically?",
          idealAnswer: "This is anchoring bias. The $40,000 'anchor' was set artificially high specifically to make $32,000 FEEL like a bargain - even if the car is only worth $28,000. Your brain compares to the first number it sees, not to actual market value. Dealers set high anchors intentionally. Defense: research market prices BEFORE seeing the sticker. Compare to independent valuations, not the dealer's anchor. Ignore their starting price entirely. The 'discount' is theater - the real question is: what's this car actually worth compared to alternatives?",
          keyPrinciples: ["First numbers anchor our perception", "Anchors are often set strategically", "Discounts from artificial anchors aren't real savings", "Research independent valuations before negotiating"]
        },
        {
          id: 24,
          title: "The Tech Portfolio",
          icon: "📊",
          skillFocus: "Logical Reasoning",
          skillType: "logical",
          color: "from-blue-600 to-blue-800",
          image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=200&fit=crop",
          question: "Your friend proudly shows their 'diversified' portfolio: 5 different tech stock funds. 'I'm protected because I didn't put all my eggs in one basket!'\n\nWhat do you notice about this 'diversification'?",
          idealAnswer: "This is false diversification. Having 5 things isn't diversified if they're all the same TYPE of thing. When tech crashes, ALL five funds crash together - they're highly correlated. Real diversification means assets that DON'T move in lockstep: different sectors (tech + healthcare + utilities), different asset classes (stocks + bonds + real estate), different geographies (US + international). The number of funds matters less than how correlated they are. Five tech funds is essentially one big bet on tech with extra fees. Different names ≠ different risks.",
          keyPrinciples: ["True diversification requires uncorrelated assets", "Multiple similar investments aren't diversified", "Correlation matters more than number of holdings", "Diversify across sectors, asset classes, geographies"]
        },
        {
          id: 25,
          title: "The Raise Decision",
          icon: "🏠",
          skillFocus: "Adaptive Learning",
          skillType: "adaptive",
          color: "from-amber-600 to-amber-800",
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop",
          question: "You just got a $20,000 raise. You're deciding between: upgrading to a nicer apartment for $800/month more, or keeping your current place and investing the difference. Your coworker says 'You earned it, treat yourself!'\n\nHow should you think about this decision?",
          idealAnswer: "I'd reframe to see the true cost. '$800/month more for a nicer place' sounds small. But compound it: $800/month invested for 30 years at 7% return = potentially $500,000+ at retirement. The 'upgrade' might cost half a million dollars in foregone growth. This isn't about never upgrading - it's about seeing the TRUE size of the decision before choosing. 'Lifestyle creep' happens when each 'small' upgrade compounds without recognizing long-term opportunity costs. Frame decisions in terms of what you're giving up, not just what you're getting.",
          keyPrinciples: ["Small recurring costs compound dramatically", "Reframe decisions to see true long-term costs", "Lifestyle creep accumulates invisibly", "Consider opportunity cost of foregone investment"]
        }
        ]
    },
    {
      id: 6,
      name: "Health & Wellness",
      icon: "🏥",
      color: "from-cyan-700 to-blue-900",
      borderColor: "border-cyan-500",
      description: "Critical thinking about medical claims",
      unlocked: true,
      puzzles: [
        {
          id: 26,
          title: "The Screening Test Paradox",
          icon: "🩺",
          skillFocus: "Logical Reasoning",
          skillType: "logical",
          color: "from-cyan-600 to-cyan-800",
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop",
          question: "A disease affects 1 in 1,000 people. A test is 99% accurate. You test positive. A doctor says 'You almost certainly have the disease - the test is 99% accurate!' Your family panics.\n\nWhat's wrong with the doctor's reasoning?",
          idealAnswer: "The doctor is ignoring base rates (how rare the disease is). If 1,000 people are tested: 1 person has it (and likely tests positive), but 999 don't have it - and 1% of those (about 10 people) will get false positives. So 11 positive tests total, but only 1 is real. Even with a positive test, there's only about a 1 in 11 (9%) chance you actually have the disease! The test's 99% accuracy doesn't mean 99% chance of having the disease. This is why doctors order confirmatory tests before treating rare diseases.",
          keyPrinciples: ["Consider base rates (how common the condition is)", "False positives are common for rare diseases even with accurate tests", "Test accuracy ≠ probability of having the disease", "Bayes' theorem applies to medical testing"]
        },
        {
          id: 27,
          title: "The Vaccination Correlation",
          icon: "💉",
          skillFocus: "Bias Detection",
          skillType: "bias",
          color: "from-green-600 to-green-800",
          image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=200&fit=crop",
          question: "A parent posts: 'My son got vaccinated at 18 months and was diagnosed with autism at 24 months. The vaccine caused it!' The post goes viral with thousands sharing similar stories.\n\nWhat cognitive bias is at work here?",
          idealAnswer: "This is the post hoc fallacy ('after this, therefore because of this'). Children get vaccinated around the same age when autism symptoms first become noticeable - correlation by developmental timing, not causation. If millions of kids are vaccinated, thousands WILL coincidentally develop autism shortly after, purely by chance timing. The pattern looks meaningful to individuals but is explained by: (1) when vaccines are given overlaps with (2) when autism is typically diagnosed. Massive studies comparing vaccinated vs. unvaccinated populations show no causal link - the timing is coincidental.",
          keyPrinciples: ["Temporal correlation doesn't prove causation", "Developmental milestones create coincidental timing", "Individual anecdotes can't establish causation", "Large population studies control for coincidence"]
        },
        {
          id: 28,
          title: "The Celebrity Cure",
          icon: "⭐",
          skillFocus: "Source Evaluation",
          skillType: "source",
          color: "from-purple-600 to-purple-800",
          image: "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=400&h=200&fit=crop",
          question: "A famous celebrity credits an alternative treatment for curing their serious illness. They share their journey on social media with millions of followers. Medical associations warn it's unproven. Your sick relative wants to try it.\n\nHow should you evaluate the celebrity's claim?",
          idealAnswer: "Celebrity testimonials are terrible medical evidence. Key problems: (1) Did they ONLY do the alternative treatment, or also conventional medicine? (2) Did they even have the disease, or was it misdiagnosed? (3) Would they have recovered anyway (spontaneous remission)? (4) How many people tried it and FAILED but aren't famous? (5) Celebrities are paid endorsers, not medical experts. The plural of anecdote is not data. For life-threatening illness, demand: peer-reviewed studies, controlled trials, expert consensus - not celebrity stories. Hope is powerful but shouldn't override evidence standards when lives are at stake.",
          keyPrinciples: ["Celebrity status doesn't confer medical expertise", "Single success stories don't prove treatment efficacy", "Consider selection bias (failures aren't publicized)", "Life-threatening decisions require rigorous evidence"]
        },
        {
          id: 29,
          title: "The Painkiller Study",
          icon: "💊",
          skillFocus: "Decision Making",
          skillType: "decision",
          color: "from-red-600 to-red-800",
          image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=200&fit=crop",
          question: "Drug X reduces pain by 50% compared to placebo in a 6-month trial of 100 patients. Drug Y reduces pain by 30% in a 10-year trial of 10,000 patients. Your doctor recommends Y despite the 'worse' numbers.\n\nWhy might your doctor be right?",
          idealAnswer: "Sample size and timeframe matter enormously. Drug X's impressive 50% might be: (1) luck from small sample (100 people), (2) novelty effect that fades, (3) hiding side effects that appear after 6 months. Drug Y's 30% is more reliable because: 10,000 patients reduce random variation, and 10 years reveal long-term safety and sustained effectiveness. A smaller but more reliable benefit is often better than a larger but uncertain one. Especially for chronic conditions requiring long-term use. Big short-term results can be flashy but misleading. Consistent long-term moderate results are often the better choice.",
          keyPrinciples: ["Larger samples provide more reliable results", "Long-term studies reveal sustained effects and safety", "Impressive short-term results may not hold", "Moderate reliable benefits often beat uncertain large ones"]
        },
        {
          id: 30,
          title: "The Fitness Tracker Fallacy",
          icon: "⌚",
          skillFocus: "Adaptive Learning",
          skillType: "adaptive",
          color: "from-orange-600 to-orange-800",
          image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=200&fit=crop",
          question: "A study finds: 'People who use fitness trackers exercise 30% more.' A health company concludes: 'Give everyone trackers to increase exercise!' They distribute 10,000 free trackers but 6 months later see no population-level exercise increase.\n\nWhat went wrong?",
          idealAnswer: "This is selection bias meeting reality. The original study compared tracker users to non-users, but PEOPLE WHO BUY TRACKERS ARE ALREADY MORE MOTIVATED TO EXERCISE. The tracker didn't cause the exercise difference - exercise motivation caused tracker purchase. When you give trackers to random people (not self-selected fitness enthusiasts), the correlation disappears. This same pattern applies to: diet apps, educational tools, productivity software. Products that 'work' for motivated early adopters often fail when deployed to unmotivated populations. Correlation in observational data doesn't predict intervention results.",
          keyPrinciples: ["Self-selection bias in who adopts products", "Motivated users aren't representative of general population", "Observational correlations don't predict intervention effects", "Same pattern applies across health/education/productivity tools"]
        }
      ]
    },
    {
      id: 7,
      name: "Environmental Science",
      icon: "🌍",
      color: "from-green-700 to-emerald-900",
      borderColor: "border-green-500",
      description: "Analyze climate and ecology claims",
      unlocked: true,
      puzzles: [
        {
          id: 31,
          title: "The Cold Winter Argument",
          icon: "❄️",
          skillFocus: "Logical Reasoning",
          skillType: "logical",
          color: "from-blue-600 to-blue-800",
          image: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=400&h=200&fit=crop",
          question: "It's an unusually cold winter with record snowfall. Someone posts: 'So much for global warming! Look at all this snow - climate change is a hoax!'\n\nWhat's the flaw in this reasoning?",
          idealAnswer: "This confuses weather with climate. Weather is day-to-day or seasonal variation; climate is long-term trends over decades. One cold winter doesn't disprove global warming any more than one hot day proves it. In fact, climate change can cause MORE extreme weather in both directions - including intense snowstorms. The logic is like saying 'the stock market went up today, so the 2008 crash never happened.' Short-term variation doesn't erase long-term trends. Climate scientists look at global temperatures over decades, not local weather over days.",
          keyPrinciples: ["Weather is short-term, climate is long-term trends", "Single data points don't disprove trends", "Climate change affects variability and extremes", "Local conditions don't represent global patterns"]
        },
        {
          id: 32,
          title: "The Recycling Contradiction",
          icon: "♻️",
          skillFocus: "Decision Making",
          skillType: "decision",
          color: "from-green-600 to-green-800",
          image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=200&fit=crop",
          question: "An investigation reveals that 70% of recycling in your city is actually sent to landfills due to contamination. A friend concludes: 'Recycling is a lie - I'm done sorting trash.'\n\nIs this the right response to this information?",
          idealAnswer: "No - this is all-or-nothing thinking. The finding shows the CURRENT system is broken, not that recycling itself is worthless. Better responses: (1) Learn what CAN be effectively recycled (clean paper, certain plastics), (2) Reduce contamination by rinsing containers, (3) Advocate for better systems/infrastructure, (4) Focus more on 'reduce' and 'reuse' than 'recycle.' The existence of a broken system doesn't mean the concept is invalid. Also, even 30% actually recycled is better than 0%. Perfect shouldn't be the enemy of good. Fix systems, don't abandon goals.",
          keyPrinciples: ["Broken implementation doesn't invalidate the concept", "All-or-nothing thinking misses improvement opportunities", "Focus on what you can control (contamination reduction)", "System problems require system solutions, not individual abandonment"]
        },
        {
          id: 33,
          title: "The Corporate Pledge",
          icon: "🏢",
          skillFocus: "Source Evaluation",
          skillType: "source",
          color: "from-cyan-600 to-cyan-800",
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop",
          question: "A major corporation announces 'We're now carbon neutral!' with a big PR campaign. Digging deeper, you find: they bought carbon offsets from a forestry project but didn't actually reduce their emissions.\n\nWhat's the problem here?",
          idealAnswer: "This is greenwashing through accounting tricks. 'Carbon neutral' sounds like they stopped polluting, but they just paid to shift the numbers on paper. Problems: (1) They're still emitting the same amount, (2) Carbon offsets are hard to verify and often overestimate impact, (3) Forest projects might have happened anyway, (4) It's cheaper to buy offsets than reduce emissions, so there's no incentive to change. Real climate action means REDUCING emissions, not offsetting them. Offsets can complement reductions but shouldn't replace them. Watch for vague pledges, check actual emission data, and be skeptical of solutions that are suspiciously easy.",
          keyPrinciples: ["Distinguish accounting neutrality from actual emission reduction", "Carbon offsets are often overestimated or non-additional", "PR campaigns may obscure lack of real action (greenwashing)", "Verify specific actions, not just pledges"]
        },
        {
          id: 34,
          title: "The Plastic Straw Ban",
          icon: "🥤",
          skillFocus: "Adaptive Learning",
          skillType: "adaptive",
          color: "from-purple-600 to-purple-800",
          image: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=400&h=200&fit=crop",
          question: "Your city bans plastic straws to 'save the ocean.' Analysis shows straws are 0.02% of ocean plastic, while fishing nets are 46%. Critics say the ban is 'meaningless virtue signaling.'\n\nHow do you evaluate both the policy and the criticism?",
          idealAnswer: "Both sides have points. The policy IS disproportionate to impact - fishing gear matters vastly more. However: (1) Straw bans are politically easier than regulating fishing industries, (2) They raise awareness and can be a 'gateway' to bigger changes, (3) Small visible actions can shift norms and culture. BUT: (4) We shouldn't stop at easy symbolic wins, (5) Resources spent on straws could target bigger sources, (6) False sense of accomplishment can prevent real action. The criticism isn't wrong, but the question is: does this enable or substitute for real action? Context matters. Use this pattern: celebrate small wins, but don't declare victory. Keep pushing for proportionate responses to big problems.",
          keyPrinciples: ["Evaluate actions proportionate to actual impact", "Symbolic actions can enable OR substitute for real change", "Political feasibility vs. environmental impact tradeoffs", "Small wins are fine if they don't prevent bigger necessary changes"]
        },
        {
          id: 35,
          title: "The Local Food Movement",
          icon: "🚜",
          skillFocus: "Bias Detection",
          skillType: "bias",
          color: "from-amber-600 to-amber-800",
          image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=200&fit=crop",
          question: "'Buy local food to reduce your carbon footprint!' But studies show: greenhouse-grown local tomatoes in winter have 10x the emissions of imported tomatoes grown outdoors in warm climates and shipped.\n\nWhat bias makes 'food miles' misleading?",
          idealAnswer: "This is the 'what you see is obvious' bias - transportation is visible, but production emissions are invisible. The MAJORITY of food's carbon footprint is in PRODUCTION (farming, heating greenhouses, fertilizer), not transportation. A local heated greenhouse can emit far more than growing outdoors naturally + shipping. 'Food miles' feels intuitive but often misleads. Better metrics: HOW food is produced (organic vs. conventional, greenhouse vs. field, beef vs. plants) matters more than WHERE. The lesson: visible factors aren't always the most important ones. Check full lifecycle analysis, not just the obvious visible part.",
          keyPrinciples: ["Visible factors (transport) aren't always the biggest impacts", "Production methods matter more than distance", "Full lifecycle analysis reveals hidden impacts", "Intuitive solutions can be wrong when systems are complex"]
        }
      ]
    },
    {
      id: 8,
      name: "Legal & Justice",
      icon: "⚖️",
      color: "from-gray-700 to-slate-900",
      borderColor: "border-gray-500",
      description: "Evaluate legal reasoning and fairness",
      unlocked: true,
      puzzles: [
        {
          id: 36,
          title: "The Eyewitness Confidence",
          icon: "👁️",
          skillFocus: "Source Evaluation",
          skillType: "source",
          color: "from-blue-600 to-blue-800",
          image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=400&h=200&fit=crop",
          question: "A robbery witness testifies: 'I'm 100% certain that's the man I saw. I'll never forget that face.' The jury is convinced by their confidence. But research shows confident eyewitnesses are wrong 30% of the time.\n\nWhy is confidence misleading here?",
          idealAnswer: "Confidence and accuracy are poorly correlated in memory. Witnesses can be confidently wrong because: (1) Memory is reconstructive - we fill gaps with assumptions, (2) Repeated questioning strengthens false memories, (3) Stress during crimes impairs encoding, (4) Cross-racial identification is especially unreliable, (5) Confident delivery is persuasive but not diagnostic of truth. Juries overweight confidence because it FEELS like certainty. Better evidence: corroborating physical evidence, multiple independent witnesses, video footage. The lesson applies beyond courts: conviction in delivery doesn't equal accuracy of content. Confidence is a feeling, not a fact.",
          keyPrinciples: ["Confidence doesn't correlate well with accuracy", "Memory is reconstructive and malleable", "Stress and suggestion create false memories", "Persuasive delivery ≠ reliable information"]
        },
        {
          id: 37,
          title: "The Recidivism Algorithm",
          icon: "🤖",
          skillFocus: "Bias Detection",
          skillType: "bias",
          color: "from-red-600 to-red-800",
          image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=200&fit=crop",
          question: "An AI predicts who will re-offend to help judges set bail. It's 70% accurate overall. Investigation reveals: it's 80% accurate for white defendants but only 60% accurate for Black defendants, with higher false positive rates for Black defendants.\n\nWhat's the problem and why does it matter?",
          idealAnswer: "This is algorithmic bias and disparate impact. The AI was trained on historical data reflecting existing biases in policing and prosecution - Black defendants are more likely to be arrested and charged for the same behaviors. The algorithm learned and amplified these biases. Higher false positives mean innocent Black defendants are incorrectly labeled high-risk and denied bail. This creates feedback loops: denied bail → lose jobs → worse outcomes → validates algorithm's prediction. The overall 70% accuracy hides the unequal error distribution. When AI decisions affect freedom, fairness across groups matters more than aggregate accuracy. Bias in training data produces biased predictions.",
          keyPrinciples: ["Algorithms can encode and amplify existing biases", "Overall accuracy can hide disparate impact across groups", "Training data reflects historical injustices", "False positives have severe consequences for individuals"]
        },
        {
          id: 38,
          title: "The Plea Bargain Pressure",
          icon: "⚖️",
          skillFocus: "Decision Making",
          skillType: "decision",
          color: "from-purple-600 to-purple-800",
          image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=200&fit=crop",
          question: "You're innocent but charged with a crime. Prosecutor offers: plead guilty, get 1 year; go to trial and if convicted (which they claim is likely), get 10 years. You can't afford a good lawyer. Trial is in 2 weeks.\n\nWhat makes this decision ethically problematic?",
          idealAnswer: "This is coercion masquerading as choice. The 'option' to go to trial is illusory when: (1) The penalty gap is so extreme it terrorizes rational people into pleading, (2) You can't afford adequate defense (wealth determines justice), (3) Even innocent people plead guilty to avoid risk, (4) Prosecutors have overwhelming power to threaten, (5) This bypasses trial by jury entirely. The problem: systems designed to avoid trial congestion create pressure that extracts guilty pleas from innocents. When 'options' are structured with extreme consequences, choice isn't really free. This applies beyond legal contexts - any 'choice' made under duress or massive power imbalances isn't truly voluntary.",
          keyPrinciples: ["Extreme consequence gaps create coercion, not choice", "Economic inequality determines access to justice", "System design can pressure innocent people to plead guilty", "Power imbalances negate meaningful consent"]
        },
        {
          id: 39,
          title: "The Tough-on-Crime Law",
          icon: "🔒",
          skillFocus: "Adaptive Learning",
          skillType: "adaptive",
          color: "from-orange-600 to-orange-800",
          image: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400&h=200&fit=crop",
          question: "A state passes mandatory minimum sentences to 'reduce crime by being tough.' Crime initially drops 15%. Politicians declare success. But a study comparing to neighboring states shows they also had 15% drops without the law.\n\nWhat does this reveal about the policy?",
          idealAnswer: "This shows the importance of control groups and regional trends. The crime drop likely wasn't CAUSED by the law - it was happening everywhere due to other factors (economy, demographics, technology). Without the comparison, politicians falsely attributed natural trends to their policy. This is the 'post hoc' fallacy at scale. The same pattern appears in: education reforms, business changes, medical treatments. Things often improve or worsen regardless of our interventions. To actually prove causation, you need: what happened WITH the intervention vs. what would have happened WITHOUT it. Otherwise you're just taking credit for (or blaming yourself for) natural variation.",
          keyPrinciples: ["Need control groups to establish causation", "Regional/temporal trends affect all areas similarly", "Post hoc fallacy applies to policy evaluation", "Compare to counterfactual: what would have happened anyway?"]
        },
        {
          id: 40,
          title: "The Torture Ticking Bomb",
          icon: "💣",
          skillFocus: "Logical Reasoning",
          skillType: "logical",
          color: "from-red-600 to-red-800",
          image: "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?w=400&h=200&fit=crop",
          question: "'If torturing one terrorist could save a city from a ticking time bomb, wouldn't it be justified?' This hypothetical is used to argue for torture policies.\n\nWhat makes this hypothetical misleading for real policy?",
          idealAnswer: "This is a constructed hypothetical that stacks unrealistic assumptions to force a conclusion. Problems: (1) You KNOW they have info (in reality, often wrong person), (2) You KNOW torture will work (evidence shows it produces false confessions), (3) There's a specific deadline (real threats are ambiguous), (4) It's one person vs. many (creates false dichotomy). The scenario is designed to make torture seem rational by removing all real-world uncertainties. But policies aren't implemented in perfect-knowledge scenarios - they're applied messily by fallible humans to ambiguous situations. The logic trick: construct an impossible scenario where X seems justified, then use it to justify X in messy reality. Reject hypotheticals engineered to smuggle conclusions.",
          keyPrinciples: ["Extreme hypotheticals smuggle assumptions that don't hold in reality", "Policy operates in uncertainty, not perfect knowledge", "Torture produces unreliable information", "Don't let edge cases determine general rules"]
        }
      ]
    },
    {
      id: 9,
      name: "Technology & Privacy",
      icon: "🔐",
      color: "from-violet-700 to-purple-900",
      borderColor: "border-violet-500",
      description: "Navigate digital rights and data ethics",
      unlocked: true,
      puzzles: [
        {
          id: 41,
          title: "The Free App Deal",
          icon: "📱",
          skillFocus: "Logical Reasoning",
          skillType: "logical",
          color: "from-pink-600 to-pink-800",
          image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop",
          question: "A popular app is free and convenient. Your friend says: 'Who cares if they collect my data? I have nothing to hide!' Terms of service allow the company to: track location 24/7, read messages, access contacts, sell data to third parties.\n\nWhat's wrong with the 'nothing to hide' argument?",
          idealAnswer: "The 'nothing to hide' argument misunderstands privacy rights and risks. Problems: (1) You might have nothing to hide NOW, but data is permanent - future governments/employers could use it against you, (2) Privacy isn't about hiding wrongdoing - it's about autonomy and boundaries, (3) Data aggregation reveals intimate details you didn't knowingly share (political views, health, relationships), (4) You can't predict future misuse, (5) 'Nothing to hide' assumes those with power are trustworthy forever. Even innocuous data becomes dangerous in wrong hands. Privacy is like insurance - you don't need it until you desperately do, and then it's too late.",
          keyPrinciples: ["Privacy is a right, not contingent on having 'something to hide'", "Data is permanent but contexts change", "Aggregated data reveals more than individual pieces", "Can't predict future misuse by unknown parties"]
        },
        {
          id: 42,
          title: "The Smart Home Hack",
          icon: "🏠",
          skillFocus: "Decision Making",
          skillType: "decision",
          color: "from-blue-600 to-blue-800",
          image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=200&fit=crop",
          question: "Smart home devices are incredibly convenient - voice control, automation, energy savings. But a security report shows 68% of smart home devices have vulnerabilities. Your family wants to install them everywhere.\n\nHow should you think about this tradeoff?",
          idealAnswer: "This requires risk-benefit analysis with threat modeling. Questions: (1) What's at stake if hacked? (Locks/cameras = high risk, lightbulbs = low risk), (2) How attractive a target are you? (3) What's the cost of mitigation? (separate networks, regular updates), (4) What are alternatives? (manual controls as backup). Don't accept all-or-nothing framing. Nuanced approach: secure critical devices well (cameras, locks on isolated network, strong passwords), accept risk for low-stakes convenience (smart lights), keep manual backups. The lesson: convenience-security tradeoffs require granular analysis, not blanket acceptance or rejection. Different risks warrant different responses.",
          keyPrinciples: ["Risk-benefit analysis depends on what's at stake", "Not all risks are equal - prioritize high-stakes security", "Mitigation strategies exist between all-or-nothing", "Keep manual backups for critical functions"]
        },
        {
          id: 43,
          title: "The Encrypted Message Debate",
          icon: "🔒",
          skillFocus: "Adaptive Learning",
          skillType: "adaptive",
          color: "from-green-600 to-green-800",
          image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=200&fit=crop",
          question: "After a crime, police say: 'End-to-end encryption helps criminals communicate secretly. We need backdoors to access messages for investigations.' Tech companies respond: 'Backdoors make everyone vulnerable to hackers.'\n\nHow do you evaluate this debate?",
          idealAnswer: "This is a genuine tradeoff with no perfect solution, requiring careful analysis. Law enforcement perspective has merit: criminals DO use encryption. But technical reality: (1) 'Backdoors for good guys only' is mathematically impossible - any backdoor can be exploited by bad actors, (2) Weakening encryption endangers billions of innocent users, (3) Sophisticated criminals will use foreign or custom encryption anyway, (4) Alternatives exist: metadata analysis, traditional investigation. The security-surveillance tradeoff is real, but backdoors don't actually solve the law enforcement problem while creating massive security vulnerabilities. This pattern applies elsewhere: complex tradeoffs where neither side is simply wrong, but one solution has critical technical flaws.",
          keyPrinciples: ["Security backdoors can't distinguish authorized from unauthorized access", "Weakening security for all to catch few is poor tradeoff", "Sophisticated adversaries will circumvent weakened systems", "Real tradeoffs exist but some 'solutions' don't actually work technically"]
        },
        {
          id: 44,
          title: "The Personalized Feed",
          icon: "🎯",
          skillFocus: "Bias Detection",
          skillType: "bias",
          color: "from-purple-600 to-purple-800",
          image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=200&fit=crop",
          question: "You notice your social media feed perfectly aligns with your views - everyone seems to agree with you on politics, values, everything. You feel validated and informed. But research shows you're in a 'filter bubble.'\n\nWhat are the hidden costs of personalized content?",
          idealAnswer: "Personalized feeds create epistemic closure with severe costs: (1) You're unaware of what you're NOT seeing (invisible gaps), (2) False consensus effect - thinking your bubble's views are universal, (3) Inability to understand opposition (they're not crazy, you just never see their best arguments), (4) Extreme polarization when bubbles never intersect, (5) Difficulty detecting your own biases (need friction and disagreement). The algorithm maximizes engagement, not truth or understanding. Antidotes: actively seek disagreement, follow people you disagree with, use chronological feeds, recognize that comfort = potential epistemic danger. Feeling validated is pleasant but might signal you're in an echo chamber.",
          keyPrinciples: ["Personalization creates invisible information gaps", "Engagement optimization doesn't align with truth-seeking", "Echo chambers prevent understanding of opposing views", "Intellectual discomfort is epistemically healthy"]
        },
        {
          id: 45,
          title: "The Deepfake Evidence",
          icon: "🎭",
          skillFocus: "Source Evaluation",
          skillType: "source",
          color: "from-red-600 to-red-800",
          image: "https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=400&h=200&fit=crop",
          question: "Deepfake technology can now create realistic fake videos of anyone saying anything. A friend argues: 'Video evidence is now worthless - we can't trust anything we see anymore.'\n\nIs this the right conclusion about video evidence?",
          idealAnswer: "No - this is catastrophizing that ignores verification methods. Reality: (1) Deepfakes aren't perfect - forensic analysis can detect them (artifacts, lighting inconsistencies, blinking patterns), (2) Provenance matters - direct from trusted source vs. random social media, (3) Context verification - does it align with other evidence?, (4) Expert authentication exists and improves, (5) Most video is still real - deepfakes require effort. Better framing: treat video like any evidence - verify source, check for manipulation signs, corroborate with independent evidence, consult experts for high-stakes decisions. The lesson: new deception methods don't make all evidence worthless; they require better verification standards. Adapt methods, don't abandon evidence.",
          keyPrinciples: ["New deception tech requires better verification, not abandoning evidence", "Forensic methods can detect manipulation", "Source provenance matters", "Most content is still authentic - don't catastrophize"]
        }
      ]
    }
    ];  