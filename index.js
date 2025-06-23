        const h2 = document.querySelector(".h2");
        let optionI = document.querySelectorAll(".optionI");
        const options = document.querySelector(".options");
        const on = document.querySelector(".on");
        const yes = document.querySelector(".yes");
        const error = document.querySelector(".error");
        const settingsBtn = document.querySelector(".settingsBtn");
        const settings = document.querySelector(".settings");
        const closeBtn = document.querySelector(".close");
        const cate = document.querySelectorAll(".setContainer .toggle");
        const diffCheck = document.querySelectorAll(".div2 .toggle");
        const cor = document.querySelector(".correct");
        const inc = document.querySelector(".incorrect");

        let choices = [];
        let categories = [];
        let diff = [];
        let html;
        let oneTry = 0;
        let isAnswering = true;
        let correct = 0;
        let incorrect = 0;

        cate.forEach((box) => {
            box.addEventListener('change', (event) => {
                if (event.target.checked){
                    categories.push(event.target.value);
                }
                else{
                    categories = categories.filter((v) => v !== event.target.value);
                }
            })
        });

        diffCheck.forEach((box) => {
            box.addEventListener('change', (event) => {
                if (event.target.checked){
                    diff.push(event.target.value);
                }
                else{
                    diff = diff.filter((v) => v !== event.target.value);
                }
            })
        });
        settings.showModal();


        settingsBtn.addEventListener('click', () => {
            settings.showModal();
            categories = [];
            diff = [];
        })

        closeBtn.addEventListener('click', () => {
            settings.close();
            if (categories.length === 0){
                categories = [
                "music",
                "sport_and_leisure",
                "film_and_tv",
                "arts_and_literature",
                "history",
                "society_and_culture",
                "science",
                "geography",
                "food_and_drink",
                "general_knowledge"
                ];
            }

            if (diff.length === 0){
                diff = [
                    "easy",
                    "medium",
                    "hard"
                ];
            }

            fetchQ(categories, diff);
        })

        async function fetchQ(c, d){
            try{
                const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${c.join(",")}&difficulties=${d.join(",")}`);
                const data = await response.json();
                newQ(data);
            }
            catch(error){
                error.innerHTML = "Please Reload the Page"
                console.error(error);
            }
        }

        function newQ(data){
            oneTry = 0;
            choices = [];
            h2.textContent = data[0].question.text;
            let answer = {
                choice: data[0].correctAnswer,
                value: "c"
            }
            choices.push(answer);
            data[0].incorrectAnswers.forEach(q => {
                let wrong = {
                    choice: q,
                    value: "w"
                }
                choices.push(wrong);
            })

            for (let i = 0; i < 4; i++){
                let number = Math.floor(Math.random() * 4);
                [choices[i], choices[number]] = [choices[number], choices[i]];
            }

            html = `<div class="option">
                <span>A.</span><span>${choices[0].choice}</span>
                <input class="optionI" type="radio" name="o" value=${choices[0].value}>
            </div>
            <div class="option">
                <span>B.</span><span>${choices[1].choice}</span>
                <input class="optionI" type="radio" name="o" value=${choices[1].value}>
            </div>
            <div class="option">
                <span>C.</span><span>${choices[2].choice}</span>
                <input class="optionI" type="radio" name="o" value=${choices[2].value}>
            </div>
            <div class="option">
                <span>D.</span><span>${choices[3].choice}</span>
                <input class="optionI" type="radio" name="o" value=${choices[3].value}>
            </div>`;

            options.innerHTML = html;
            optionI = document.querySelectorAll(".optionI");

            on.textContent = "Submit";
            yes.textContent = "";
        }

        on.addEventListener('click', () => {
            if (isAnswering){

                let selected = Array.from(optionI).find(opt => opt.checked);
                if (!selected){
                    yes.innerHTML = "Please Select an Option."
                    return;
                }

                on.textContent = "Next";
                isAnswering = false;

                optionI = document.querySelectorAll(".optionI");

                if(oneTry === 1){
                    return;
                }
                optionI.forEach((option) => {
                    if (option.checked && option.value === "c"){
                        option.style.backgroundColor = "rgba(55, 255, 0, 0.527)";
                        yes.textContent = "Correct!";
                        oneTry++;
                        correct++;
                        cor.innerHTML = correct;
                    }
                    else if(option.checked && option.value === "w"){
                        option.style.backgroundColor = "rgba(255, 0, 0, 0.527)";
                        yes.textContent = "Not quite...";
                        incorrect++;
                        inc.innerHTML = incorrect;
                        optionI.forEach(o => {
                            if(o.value === "c"){
                                o.style.backgroundColor = "rgba(55, 255, 0, 0.527)";
                            }
                        })
                        oneTry++;
                    }
                    else{
                        return;
                    }
                })
            }
            else{
                isAnswering = true;
                fetchQ(categories, diff);
            }
        })
