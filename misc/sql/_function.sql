CREATE OR REPLACE FUNCTION pixiv.pull_bit(num int4, start int4 DEFAULT 0, len int4 DEFAULT 1) RETURNS int4 AS $$
	BEGIN
		RETURN (num>>(start-1))&(~(255<<len));
	END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION pixiv.push_bit(num int4, start int4 DEFAULT 0, len int4 DEFAULT 1, add int4) RETURNS int4 AS $$
	BEGIN
		RETURN (num&(~(255::BIT(len)::int4<<start)))|(add<<start)
	END
$$ LANGUAGE plpgsql;