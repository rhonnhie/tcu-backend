"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantService = void 0;
const express_helper_1 = require("@jmrl23/express-helper");
const announcement_service_1 = require("./announcement.service");
const question_service_1 = require("./question.service");
const event_service_1 = require("./event.service");
class AssistantService {
    constructor(announcementService, questionService, eventService, apiUrl, apiKey, model, maxTokens) {
        this.announcementService = announcementService;
        this.questionService = questionService;
        this.eventService = eventService;
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.model = model;
        this.maxTokens = maxTokens;
    }
    static async getInstance() {
        if (!AssistantService.instance) {
            const instance = new AssistantService(await announcement_service_1.AnnouncementService.getInstance(), await question_service_1.QuestionService.getInstance(), await event_service_1.EventService.getInstance(), process.env.ASSISTANT_API_URL, process.env.ASSISTANT_API_KEY, process.env.ASSISTANT_API_MODEL, 500);
            AssistantService.instance = instance;
        }
        return AssistantService.instance;
    }
    async ask(assistantAskDto) {
        const questions = (await this.questionService.list({})).map(({ question, answer }) => ({ question, answer }));
        const questionString = questions
            .map(({ question, answer }) => `${question}: ${answer}`)
            .join('\n');
        const announcements = (await this.announcementService.list({
            pin: true,
        })).map(({ created_at, title, content }) => ({ created_at, title, content }));
        const events = (await this.eventService.list({
            take: 15,
        })).map(({ created_at, title, content, date_of_event }) => ({
            created_at,
            title,
            content,
            date_of_event,
        }));
        const conversation = [
            {
                role: 'system',
                content: `
            Act as a school helpdesk. 
            Your name is E-TCU. 
            Your goal is to provide school informations, announcements, and events. You are not capable in answering other than that. 
            
            Here are the rules you must follow in answering the questions: 
            - Do not address people by their names 
            - Do not answer technical related questions
            - Do not answer places other than the school address
            - Do not answer about the nation
            - Avoid redundant answers 
            - Make your answer short as possible 
            - Do not explain why you come-up with your answer 
            - Answer in taglish if the question contains a tagalog word
            - Check the spelling if it's correct
            - Do not reply to any languages other than english and tagalog 
    
            Here are the informations about the school: 
            - Name: Taguig City University (TCU) 
            - Address: General Santos Ave, Lower Bicutan, Taguig, 1632 Metro Manila 
            - Mission: To nurture a vibrant culture of academic wellness responsive to the challenges of technology and the global community 
            - Vision: An eminent center of excellent higher education towards social advancement 
            - Philosophy: Social transformation for a caring community and an ecologically balanced country
            - courses: [{"College": "College of Arts and Sciences (CAS)","Programs": ["Bachelor of Science in Psychology (BSP)","Bachelor of Science in Social Work (BSSW)","Bachelor of Science in Public Administration (BSPA)"]},{"College": "College of Business Management (CBM)","Programs": ["Bachelor of Science in Business Administration major in Marketing Management (BSBA-MM)","Bachelor of Science in Business Administration major in Human Resource Management (BSBA-HRM)","Bachelor of Science in Office Administration (BSOA)","Bachelor of Science in Entrepreneurship (BSE)"]},{"College": "College of Criminal Justice (CCJ)","Programs": ["Bachelor of Science in Criminology (BS Crim)"]},{"College": "College of Education (COE)","Programs": ["Bachelor of Secondary Education (BSEd) major in English","Bachelor of Secondary Education (BSEd) major in Mathematics","Bachelor of Secondary Education (BSEd) major in Science","Bachelor of Elementary Education"]},{"College": "College of Engineering and Technology (CET)","Programs": ["Bachelor of Science in Industrial Engineering (BSIE)","Bachelor of Science in Industrial Technology major in Electrical","Bachelor of Science in Industrial Technology major in Electronics","Bachelor of Science in Civil Engineering major in Structural Engineering","Bachelor of Science in Civil Engineering major in Transportation Engineering","Bachelor of Science in Mechanical Engineering"]},{"College": "College of Hospitality and Tourism Management (CHTM)","Programs": ["Bachelor of Science in Hospitality and Management (BSHM)","Bachelor of Science in Tourism Management (BSTM)"]},{"College": "College of Information and Communication Technology (CICT)","Programs": ["Bachelor of Science in Computer Science (BSCS)","Bachelor of Science in Information Systems (BSIS)"]}]
            - Tuition: None, TCU is locally funded University of the City Government of Taguig.
            - Online Admission: Links are provided at the TCU OSAS FB page
            - apply for admission: Taguig residents are certified voters are priority. Students with complete documentary requirements.
            - dress code: for men: no piercings, no hair color
            - Can I transfer n TCU: According to Office of the University Registrar (OUR) they are not accepting Transferees from other school but only to the balik-Aral  students who are TCU students before.
            - When will the list of students who passed the entrance exam be released?: The rleased of List of Students who passed the exam will be on July 14, 2023
            - Does the TCU accept transferee students?:  According to Office of the University Registrar (OUR) they are not accepting Transferees from other school but only to the balik-Aral  students who are TCU students before.
            - Is there any specific GWA or standardized grade requirements for admission/enrollment to TCU?: The TCU doesn't required any grade average for admission/enrollment.
            - Until when is the enrollment period for TCU For Freshmen:?: February 12, 2023
            - Until when is the enrollment period for TCU For Balik-Aral:?: January 30, 2023
            - Until when is the enrollment period for TCU For Masteral:?: February 22, 2023
            list or requirements: voters id, card, form 137
            - When is the schedule of the entrance examination for Freshmen: May 3-5, 2023
            - When is the schedule of the entrance examination for Masterals: May 12-13, 2023
            - When is the schedule of the entrance examination for balik-Aral: May 15, 2023
            - Where can I see the result of the exam for freshmen?: The result of the exam will be on July 14, 2023
            - Where can I see the result of the exam for Balik-Aral?: The result of the exam will be on July 20, 2023
            - Where can I see the result of the exam for Masterals?: The result of the exam will be on July 25, 2023
            - What is the deadline for submitting application for admission?: Febuary 10, 2023
            - Is it necessary to be a taguig voter to enroll in Taguig City University?: Yes, according to the Office of the Universiity Registrar(OUR) posted requirements.
            - What month will TCU's first Semester start?: September to December and the second semester start in January to June
            - What Month will TCU school year end?: June
            - Is there a ROTC in TCU?: Yes
            - Who can apply for Admission?: Taguig residents and certified voters are priority. Also, those Students with complete documentary requirements.
            - What sports are there at TCU?: Badminton, Volleyball, Basketball, Dart, chess, swimming
            - announcements: ${JSON.stringify(announcements)}
            - events: ${JSON.stringify(events)}
            ${questionString}
          `,
            },
        ];
        conversation.push({
            role: 'user',
            content: assistantAskDto.content,
        });
        const answer = await this.makeApiRequest(conversation);
        conversation.push({
            role: 'assistant',
            content: answer,
        }, {
            role: 'user',
            content: 'Generate a JSON array that contains 3 question suggestions that can be asked based on your previous response, follow this format: [string, string, string]',
        });
        const suggestions = this.parseSuggestions(await this.makeApiRequest(conversation));
        return {
            answer,
            suggestions,
        };
    }
    async makeApiRequest(messages) {
        const response = await fetch(`${this.apiUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                max_tokens: this.maxTokens,
                messages,
            }),
        });
        const jsonResponse = await response.json();
        if ('error' in jsonResponse) {
            throw express_helper_1.vendors.httpErrors.InternalServerError(jsonResponse.error.message);
        }
        const data = jsonResponse.choices[0].message.content;
        return data;
    }
    parseSuggestions(suggestions) {
        try {
            const data = JSON.parse(suggestions);
            if (Array.isArray(data)) {
                return data;
            }
            return [];
        }
        catch (error) {
            return [];
        }
    }
}
exports.AssistantService = AssistantService;
