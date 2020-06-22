import QuizFormRepository from "../../remote/quiz/QuizFormRepository";
import QuizTemplateRepository from "../../remote/quiz/QuizTemplateRepository";
import QuestionRepository from "../../remote/quiz/QuestionRepository";
import AnswerRepository from "../../remote/quiz/AnswerRepository";

export default {
    async loadQuestions(formHash, token) {
        if (formHash == undefined) {
            console.log("Form hash undefined");
            return;
        }

        if (token == undefined) {
            console.log("Token undefined");
            return;
        }

        const formResponse = await QuizFormRepository.getQuizForm(
            formHash,
            token
        );

        if (formResponse.status != 200) {
            console.log("GET FORM ERROR: ", formResponse.status);
            return;
        }

        console.log("FORM RESPONSE: ", formResponse);

        const templateResponse = await QuizTemplateRepository.getTemplateContent(
            formResponse.data.form[0].tn,
            token
        );

        if (templateResponse.status != 200) {
            console.log("GET TEMPLATE ERROR: ", templateResponse.status);
            return;
        }

        console.log("TEMPLATE RESPONSE: ", templateResponse);

        const data = templateResponse.data;
        let content = data.content.content;
        let questionHashes = JSON.parse(content).questions;
        //   this.theme = JSON.parse(content).properties.theme;
        //   this.questionHashes = questionHashes;

        if (questionHashes == undefined || questionHashes.lenght == 0) {
            console.log("No question hashes found");
            return;
        }

        console.log("Question hashes: ", questionHashes);

        var questions = [];

        for (let i = 0; i < questionHashes.length; i++) {
            const questionResponse = await QuestionRepository.getQuestion(questionHashes[i], token);

            if (questionResponse.status != 200) {
                console.log("Error while fetching question");
                return;
            }

            const data = questionResponse.data.var[0];
            const question = {
                label: data.label,
                vogh: data.vogh,
                vh: data.vh,
                name: data.name
            }

            questions.push(question);
        }

        questions.forEach(async (value) => {
            let answerGroupResponse = await AnswerRepository.getAnswerGroup(value.vogh, token);

            if (answerGroupResponse.status != 200) {
                console.log("Error while fetching question answer group");
                return;
            }

            let groupHash = answerGroupResponse.data.varoptiongroup[0].vogh;

            console.log("GRoupHAsH: ", groupHash);
            let answersResponse = await AnswerRepository.getAnswerGroupAnswers(groupHash, token);

            if (answersResponse.status != 200) {
                console.log("Error while fetching question answers");
                return;
            }

            let answersData = answersResponse.data.varoptiongroup;

            value.answerGroup = { groupHash: groupHash, answers: answersData };
        });

        return questions;
    }
};