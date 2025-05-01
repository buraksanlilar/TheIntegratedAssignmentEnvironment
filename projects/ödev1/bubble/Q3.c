#include <stdio.h>
// #include <limits.h>

int main(){
	int x = 1;

	while(1){
		x *= 2;
		printf(" %d", x);
	}

	// when x takes values that int data cannot handle, the loop stops. requires <limits.h>
	/*
	while(x < INT_MAX && x > INT_MIN){
		x *= 2;
		printf(" %d", x);
	}
	*/

}
