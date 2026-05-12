# Who Are You in the Overwatch World?

## Project

This is a personality quiz for Project 4: Community Tool or Quiz. The quiz is made for Overwatch fans who connect with the game's world through character lore, animated shorts, backstories, and questions about hope, repair, identity, justice, and community.

## Community

The centered community is people in and around my own Overwatch fan circle: players and casual viewers who talk about the heroes as characters, not only as in-game roles. The opportunity is to give this group a low-pressure, playful way to reflect on which Overwatch character's story values feel closest to their own personality.

This quiz avoids sorting people by combat role. Instead, it asks about values, belonging, crisis, memory, trust, and the kind of future the user wants to help build.

## Design Process

I started with a simple lunch quiz structure, then redesigned it around Project 4's community requirement. The first version sorted users by gameplay habits, but that felt too close to role selection. I revised the questions so they connect to the Overwatch universe through story themes:

- hope after crisis
- protection and responsibility
- hidden systems and secrets
- identity after change
- community care and public joy
- justice, freedom, and rebuilding

The final version is split across four quiz pages, with two questions per page, so the experience feels like a short personality journey rather than one long form.

## Inspiration & References

- Overwatch character backstories and animated shorts
- The contrast between Overwatch as a team shooter and Overwatch as a world full of personal histories
- Personality quizzes that use reflective choices instead of direct labels
- Project 4 prompt: Community Tool or Quiz

## Technical Notes

- Built with HTML, CSS, and vanilla JavaScript.
- Uses radio buttons, a select menu, a range slider, form submission, and click event handlers.
- Split across four quiz pages plus a result page: `Lunch.html`, `page2.html`, `page3.html`, `page4.html`, and `result.html`.
- Stores the user's answers and result in `localStorage`.
- Uses the stored result to change the page background theme and show the previous result when the page is reopened.
- Uses a scoring system where each answer adds points to multiple Overwatch characters, then the highest score becomes the final result.

## User Testing Notes

Testing still needs to be completed with classmates or friends before final submission. The testing plan is:

1. Ask at least two Overwatch fans or classmates to take the quiz.
2. Watch whether they understand the four-page flow without explanation.
3. Ask if the result feels connected to the character's lore and personality.
4. Ask whether any question feels too vague, too gameplay-focused, or too obvious.
5. Revise wording based on their feedback.

## Current Self-Test

- Confirmed all five pages load locally.
- Confirmed Page 1 to Page 4 navigation works.
- Confirmed answers persist through `localStorage`.
- Confirmed the result page generates a character result.
- Confirmed the saved result changes the background theme.

## Challenges

The main challenge was translating Overwatch character backgrounds into personality traits without making the quiz feel like a combat-role sorter. Another challenge was splitting the quiz across multiple pages while keeping the user's answers saved between pages.

## Next Steps

If I had more time, I would add illustrated hero cards, more result details, a shareable result screen, and user-tested revisions based on feedback from Overwatch fans.
