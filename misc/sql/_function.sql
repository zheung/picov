CREATE OR REPLACE FUNCTION pixiv.read_bit(num int4, start int4, len int4 DEFAULT 1) RETURNS int4 AS $$
	BEGIN
		RETURN (num>>(start-1))&(~(-1<<len));
	END
$$ LANGUAGE plpgsql;