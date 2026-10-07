# Images Digital Max can show in the chat

Drop an image here with one of these names and deploy the site. Within 10 minutes
Digital Max starts showing it when the topic comes up. Images that don't exist are
never offered to the model.

| File | Shows | Used when talking about |
|---|---|---|
| discovery-process.png | Max's discovery process | discovery, user research, problem framing |
| plm-architecture.png | How the PLM/PDM systems at Volvo connect | PLM, PDM, legacy modernisation |
| ux-maturity.png | How Max thinks about UX maturity | UX maturity, design culture |
| design-system.png | Design system work | design systems, component libraries |
| impact-mapping.png | Impact mapping example | impact mapping, OKRs, prioritisation |
| user-journey.png | User journey map | journey mapping, service design |
| workshop.png | Photo from a workshop | workshops, facilitation |

To add a new image: add the file here and a line in `IMAGE_LIBRARY` in
`supabase/functions/server/index.tsx` describing what it shows and when to use it.
