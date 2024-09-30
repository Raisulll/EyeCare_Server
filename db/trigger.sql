CREATE SEQUENCE ORDER_ID_SEQ START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 1000000 NOCYCLE;

---------------------------trigger for inserting into order table --------------------

CREATE OR REPLACE TRIGGER ORDERS_ID_TRIGGER BEFORE
  INSERT ON ORDERS FOR EACH ROW
BEGIN
  SELECT
    'ORD'
    || TO_CHAR(ORDER_ID_SEQ.NEXTVAL, 'FM0000000') INTO :NEW.ORDER_ID
  FROM
    DUAL;
END;

-------------------------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER ORDER_STATUS_TRIGGER AFTER
UPDATE OF STATUS ON ORDERED_PRODUCTS FOR EACH ROW
DECLARE
  ORDER_COUNT       NUMBER;
  ACCEPTED_PRODUCTS NUMBER;
BEGIN
  SELECT
    COUNT(ORDER_ID) INTO ORDER_COUNT
  FROM
    ORDERED_PRODUCTS
  WHERE
    ORDER_ID = :NEW.ORDER_ID;

  SELECT
    COUNT(STATUS) INTO ACCEPTED_PRODUCTS 
  FROM
    ORDERED_PRODUCTS
  WHERE
    ORDER_ID = :NEW.ORDER_ID
    AND STATUS = 'Accepted'; 
 
  IF ORDER_COUNT = ACCEPTED_PRODUCTS THEN
    UPDATE ORDERS
    SET
      ORDER_STATUS = 'Accepted'
    WHERE
      ORDER_ID = :NEW.ORDER_ID;
  ELSE
    UPDATE ORDERED_PRODUCTS
    SET 
      STATUS = 'Accepted'
    WHERE
      ORDER_ID = :NEW.ORDER_ID
      AND SHOP_ID = :NEW.SHOP_ID
      AND STATUS = 'Pending';
  END IF;
END;
/

drop TRIGGER ORDER_STATUS_TRIGGER;

CREATE OR REPLACE TRIGGER ORDERED_PRODUCTS_CALCULATE_TOTAL_PRICE_TRIGGER AFTER
  INSERT OR DELETE OR UPDATE ON ORDERED_PRODUCTS FOR EACH ROW
BEGIN
  UPDATE ORDERED_PRODUCTS 
  SET 
    ORDER_PRICE = (SELECT PRODUCT_PRICE FROM SUPPLY WHERE PRODUCT_ID = :NEW.PRODUCT_ID) * :NEW.QUANTITY;
END;

DROP TRIGGER ORDERED_PRODUCTS_CALCULATE_TOTAL_PRICE_TRIGGER;