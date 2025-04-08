#include <iostream>
#include <fstream>
#include <sstream>
#include <unordered_map>
#include <vector>
#include <queue>
#include <string>
#include <algorithm>

using namespace std;

const size_t CHUNK_SIZE = 1000; // Number of lines per chunk file

// Splits a large log file into smaller chunk files
void splitLogFile(const string& inputFile) {
    ifstream inFile(inputFile);
    if (!inFile) {
        cerr << "Error opening file: " << inputFile << endl;
        return;
    }

    size_t fileIndex = 0;
    string line;
    size_t lineCount = 0;
    ofstream outFile;

    while (getline(inFile, line)) {
        // Open a new chunk file every CHUNK_SIZE lines
        if (lineCount % CHUNK_SIZE == 0) {
            if (outFile.is_open()) outFile.close();
            outFile.open("chunk_" + to_string(fileIndex++) + ".txt");
        }
        outFile << line << '\n';
        lineCount++;
    }

    if (outFile.is_open()) outFile.close();
}

// Counts the occurrences of error messages in a single chunk file
unordered_map<string, int> countErrorsInChunk(const string& chunkFile) {
    ifstream inFile(chunkFile);
    unordered_map<string, int> errorCounts;
    string line;

    while (getline(inFile, line)) {
        size_t pos = line.find("Error");
        if (pos != string::npos) {
            // Extract the error message text following "Error"
            string errorMessage = line.substr(pos + 5);
            errorCounts[errorMessage]++;
        }
    }

    return errorCounts;
}

// Merges the error counts from multiple chunk files
unordered_map<string, int> mergeErrorCounts(const vector<string>& chunkFiles) {
    unordered_map<string, int> totalCounts;

    for (const string& chunkFile : chunkFiles) {
        unordered_map<string, int> chunkCounts = countErrorsInChunk(chunkFile);
        for (const auto& pair : chunkCounts) {
            totalCounts[pair.first] += pair.second;
        }
    }

    return totalCounts;
}

// Retrieves the top N most frequent error messages
vector<pair<string, int>> findTopErrors(const unordered_map<string, int>& errorCounts, int N) {
    // Priority queue stores (count, error message), sorted by highest count
    priority_queue<pair<int, string>> pq;
    for (const auto& pair : errorCounts) {
        pq.emplace(pair.second, pair.first);
    }

    vector<pair<string, int>> topErrors;
    for (int i = 0; i < N && !pq.empty(); i++) {
        topErrors.emplace_back(pq.top().second, pq.top().first);
        pq.pop();
    }

    return topErrors;
}

// Coordinates the entire process: splits the file, analyzes chunks, and displays top errors
void findCommonErrors(string filename, int N) {
    splitLogFile(filename);

    vector<string> chunkFiles;

    // Detects all generated chunk files
    for (size_t i = 0; ifstream("chunk_" + to_string(i) + ".txt"); i++) {
        chunkFiles.push_back("chunk_" + to_string(i) + ".txt");
    }

    unordered_map<string, int> totalCounts = mergeErrorCounts(chunkFiles);
    vector<pair<string, int>> topErrors = findTopErrors(totalCounts, N);

    cout << "Top " << N << " most frequent error messages:" << endl;
    for (const auto& pair : topErrors) {
        cout << pair.first << ": " << pair.second << " occurrences" << endl;
    }
}

int main() {
    string logFile = "logs.txt";
    int N;

    cout << "Enter the number of top errors to find: ";
    cin >> N;

    findCommonErrors(logFile, N);

    return 0;
}