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

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    printf("\n");
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Kullanım: %s sayı1 sayı2 ...\n", argv[0]);
        return 1;
    }

    int n = argc - 1;
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        perror("Bellek ayrilamadi");
        return 1;
    }

    for (int i = 0; i < n; i++)
        arr[i] = atoi(argv[i + 1]);

    bubbleSort(arr, n);

    printf("Sıralı dizi: ");
    printArray(arr, n);

    free(arr);
    return 0;
}
