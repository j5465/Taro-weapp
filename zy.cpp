

int i = 0;
A.setPos(0);
while (A.rightLength()) {
    Elem a, b;
    A.getValue(a);
    int j = 1;
    while (A.rightLength()) {
        A.setPos(i + j);
        A.getValue(b);
        if (A == b)
            A.remove();
        else
            j++;
    }
    i++;
    A.setPos(i);
}
