// add click event listener to the "transcribe" button
if (document.getElementById("transcribe") !== null) {
  document.getElementById("transcribe").addEventListener("click", () => {
    // get the stored OpenAI API key
    chrome.storage.sync.get("apiKey", (data) => {
      // get the selected language from the dropdown
      var oneliner = document.getElementById("input").value;

      // display the selected text in the "original" span
      document.getElementById("original").innerHTML = oneliner;

      document.getElementById("input").value = "";

      // check if the API key is stored
      if (data.apiKey) {
        // create an XMLHttpRequest object to send a POST request to the OpenAI API
        const http = new XMLHttpRequest();
        http.open("POST", "https://api.openai.com/v1/completions", true);
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Authorization", `Bearer ${data.apiKey}`);
        http.onreadystatechange = () => {
          // check if the response is ready and the status code is 200 (OK)
          if (http.readyState === 4 && http.status === 200) {
            // parse the response as JSON
            const response = JSON.parse(http.responseText);
            // get the first choice of the response and extract the text
            const results = response.choices[0].text;
            // log the output
            console.log(`results: ${results}`);
            // display the output solutions in the "results" span
            document.getElementById("results").innerHTML = results;
          }
        };
        // send the request with the specified prompt
        http.send(
          JSON.stringify({
            model: "text-davinci-003",
            prompt: `Act as an intelligent marketer and business strategist, A/B Testing different solutions to your product. I will give you a one liner about the product and you will return 3 novel ways to validate it. Return each solution in HTML <ol> and <li>.
                  One-liner: ${oneliner}.
                Solutions: ${results}
                `,
            max_tokens: 300,
            temperature: 0.6,
          })
        );
      } else {
        // show an error message if the API key is not stored
        alert(
          "Please add your OpenAI API key to the chrome extension options."
        );
      }
    });
  });
} else {
  console.log("Click the extension to use the A/B Genie extension!");
}
