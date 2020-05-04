#include <stdio.h>
#include <stdlib.h>

int count( char* x, char* y, int n){
	int t = 0;
	for (int i = 0; i < n; ++i)
		if (x[i] != y[i])
			t++;
	return t;
}
char *insert(char* x, int index, int n){
	char *new_word;
	int i;
	for (i = 0; i < index; ++i)
		new_word[i] = x[i];
	new_word[index] = '-';
	for (i = index+1; i < n+1; ++i)
		new_word[i] = x[i-1];
	new_word[n+1] = '\0';  //needed?
	return new_word;
}

char *best1( char* longer, char* smaller, int n){//, int *ind, int *dist){  //lesser n
	int ind, dist = 100000;
	char *new_word = smaller;
	for (int i = 0; i <= n; ++i){  // up to original length
		printf("-----\n");
		char *test_word = insert(smaller, i, n);
		int new_count = count(longer, test_word, n+1);
		printf("%s\n", longer);
		printf("%s %d\n", test_word, new_count);
		if(new_count < dist){
			new_word = test_word;
			dist = new_count;
			ind = i;
		}
	}
	printf("Final: %s d%d i%i\n", new_word, dist, ind);
	return new_word;
}

int main(int argc, char const *argv[]){
	// FILE *fin;
	// fin = fopen("words.txt", "r");
	// int i = 0;
	// char words[38719][29]; // leave one space for '\0'

	// while(fscanf(fin, "%s", words[i]) != EOF)
	// 	i++;
	// fclose(fin);

	printf("Distance Between 'castle' and 'cattle': %d\n", count("castle", "cattle", 6));
	int gap = 1234, dist=123456;
	char* with_gap = best1("kitchen", "kitten", 6);//, &gap, &dist);
	printf("Distance Between 'kitchen' and 'kitten' (%s): %d\n", with_gap, dist);

	return 0;
}