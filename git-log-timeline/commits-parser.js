let CommitsParser = {

    parse: function parseCommits(text) {
        let commitSeperator = "---"
        let commits = [];
        let commitsTexts = text.split(commitSeperator);
        for (const commitText of commitsTexts) {
            if (commitText) {
                commits.push(CommitsParser.parseCommit(commitText));
            }
        }
        return commits;
    },

    parseCommit: function parseCommit(commitText) {
        let result = {
            hash: null,
            author: null,
            date: null,
            subject: null,
        };
        commitText = commitText.trim();
        let parts = commitText.split("\n");
        result.hash = parts[0];
        result.author = parts[1];
        result.date = parts[2];
        result.subject = parts[3];
        return result;
    },

};