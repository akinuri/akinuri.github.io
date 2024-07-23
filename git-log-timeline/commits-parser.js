let CommitsParser = {

    parse: function parseCommits(logOutput) {
        let commits = [];
        let commitsTexts = logOutput.split(/(?=^commit )/gm);
        for (const commitText of commitsTexts) {
            if (commitText.trim().length) {
                commits.push(CommitsParser.parseCommit(commitText));
            }
        }
        return commits;
    },

    parseCommit: function parseCommit(commitText) {
        let result = {
            hash: commitText.match(/^commit +(.+)$/m)?.[1] ?? null,
            author: commitText.match(/^Author: +(.+)$/m)?.[1] ?? null,
            date: commitText.match(/^Date: +(.+)$/m)?.[1] ?? null,
            subject: commitText.split(/\n\n/)[1].split("\n")[0].trim(),
            body: commitText.split(/\n\n/)[1].split("\n").slice(1).map(line => line.trim()).filter(line => line.length).join("\n"),
        };
        return result;
    },

};