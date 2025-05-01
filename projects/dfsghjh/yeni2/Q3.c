#include <stdio.h>
#include <stdlib.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
}

int main(int argc, char *argv[]) {
    int n = argc - 1;
    if (n <= 0) return 1;

    int *arr = (int *)malloc(n * sizeof(int));
    if (!arr) return 1;

    for (int i = 0; i < n; i++)
        arr[i] = atoi(argv[i + 1]);

    bubbleSort(arr, n);

    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    printf("\n");

    free(arr);
    return 0;
}
